const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { Pool } = require('pg');
const { settings, verifyIdentity, labSeedPasswords } = require('../../scripts/postgres-u3b-safety.cjs');
const { createDatabase } = require('../../src/db/factory');
const { createSessionService } = require('../../src/services/session.service');

// Separate opt-in runner: NEVER discovered by the normal unit suite.
// Fail before pool creation on wrong host/database/user; no dotenv or clinical config.
const config = settings(process.env, 'app');
const seedPasswords = labSeedPasswords(process.env);
let native, db, apiDb, server, base;
test.before(async () => {
  native = new Pool(config);
  await verifyIdentity(native, config);
  db = createDatabase('postgres', config);
  process.env.JWT_SECRET = 'synthetic-test-only-session-key-u3b';
  process.env.PORT = '3000';
  const app = require('../../src/index');
  apiDb = require('../../src/config/db');
  server = app.listen(0,'127.0.0.1');
  await once(server,'listening');
  base='http://127.0.0.1:'+server.address().port;
});
test.after(async () => {
  if(server) { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
  await apiDb?.end(); await db?.end(); await native?.end();
});

test('U3B real connection is the identified synthetic database and least-privileged user', async () => {
  const identity = await verifyIdentity(native, config);
  assert.equal(identity.database, config.database);
  assert.equal(identity.user, config.user);
  assert.equal((await native.query('SHOW TimeZone')).rows[0].TimeZone, 'America/Lima');
});

test('U3B clean schema has all 35 tables and no sample clinical images', async () => {
  const tables = await native.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
  const names = tables.rows.map(row => row.table_name);
  const { TABLES } = require('../../src/db/postgresSchema');
  const expected = names.includes('insumos') ? [...TABLES, 'insumos', 'insumos_operaciones'] : TABLES;
  assert.deepEqual(names.sort(), [...expected].sort());
  assert.equal(Number((await native.query('SELECT COUNT(*) AS count FROM radiografias')).rows[0].count), 0);
});

test('U3B real API health must be healthy after the completed PostgreSQL port', async () => {
    const response = await fetch(base + '/health');
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, 'healthy');
    assert.equal(body.database, 'connected');
});

test('U3B seeded patient/history/payment relation and financial precision are exact', async () => {
  const { rows } = await native.query(`SELECT p.dni,c.costo_total,pa.monto,f.margen_clinica
    FROM pacientes p JOIN historias_clinicas h ON h.paciente_id=p.id
    JOIN consultas c ON c.historia_id=h.id JOIN pagos pa ON pa.consulta_id=c.id
    JOIN finanzas_pagos f ON f.pago_id=pa.id WHERE p.dni=$1 AND pa.id=1`, ['00000001']);
  assert.deepEqual(rows, [{ dni: '00000001', costo_total: '100.00', monto: '20.00', margen_clinica: '15.00' }]);
});

test('U3B unique and foreign-key constraints reject invalid writes', async () => {
  await assert.rejects(native.query("INSERT INTO finanzas_configuracion VALUES(1,4,1)"), e => e.code === '23505');
  await assert.rejects(native.query("INSERT INTO finanzas_costos VALUES(-1,0,'SYNTHETIC')"), e => e.code === '23503');
});

test('U3B enum, POS and binary hash checks reject invalid values', async () => {
  await assert.rejects(native.query("UPDATE usuarios SET rol='NOT_A_ROLE' WHERE id='synthu3b_doctor'"), e => e.code === '23514');
  await assert.rejects(native.query('UPDATE finanzas_configuracion SET recargo_pos_porcentaje=101 WHERE id=1'), e => e.code === '23514');
  await assert.rejects(native.query('INSERT INTO seguridad_sesiones(token_hash,usuario_id,auth_version,expira_epoch) VALUES($1,$2,0,100)',
    [Buffer.alloc(1), 'synthu3b_doctor']), e => e.code === '23514');
});

test('U3B adapter transaction commit updates one row with existing result shape', async () => {
  const original = await native.query('SELECT password_hash FROM usuarios WHERE id=$1', ['synthu3b_doctor']);
  try {
    await db.transaction(async conn => {
      const [result] = await conn.query('UPDATE usuarios SET password_hash = ? WHERE id = ?',
        ['SYNTHETIC-ROLLBACK-MARKER', 'synthu3b_doctor']);
      assert.equal(result.affectedRows, 1);
    });
  } finally {
    // Restore only the known synthetic account even if an assertion fails.
    await native.query('UPDATE usuarios SET password_hash=$1 WHERE id=$2', [original.rows[0].password_hash, 'synthu3b_doctor']);
  }
});

test('U3B real intermediate failure rolls back all partial writes', async () => {
  const before = (await native.query("SELECT password_hash FROM usuarios WHERE id='synthu3b_doctor'")).rows[0].password_hash;
  await assert.rejects(db.transaction(async conn => {
    await conn.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', ['SYNTHETIC-TEMP', 'synthu3b_doctor']);
    throw new Error('SYNTHETIC_INTERMEDIATE_FAILURE');
  }), /SYNTHETIC_INTERMEDIATE_FAILURE/);
  assert.equal((await native.query("SELECT password_hash FROM usuarios WHERE id='synthu3b_doctor'")).rows[0].password_hash, before);
});

test('U3B two concurrent patient-key inserts cannot duplicate a record', async () => {
  const sql = `INSERT INTO pacientes(dni,nombres,apellidos,sexo,fecha_nacimiento,fecha_registro,hora_registro)
    VALUES($1,'FICTICIO CONCURRENCIA U3B','TEST','M','2000-01-01','2026-10-04','12:00:00') RETURNING id`;
  try {
    const results = await Promise.allSettled([native.query(sql, ['00000002']), native.query(sql, ['00000002'])]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(results.find(r => r.status === 'rejected').reason.code, '23505');
    assert.equal(Number((await native.query("SELECT COUNT(*) AS count FROM pacientes WHERE dni='00000002'")).rows[0].count), 1);
  } finally { await native.query("DELETE FROM pacientes WHERE dni='00000002'"); }
});

test('U3B two clients respect FOR UPDATE and recover after lock timeout', async () => {
  const a = await native.connect(), b = await native.connect();
  try {
    await a.query('BEGIN'); await b.query('BEGIN');
    await a.query('SELECT id FROM finanzas_configuracion WHERE id=1 FOR UPDATE');
    await b.query("SET LOCAL lock_timeout='100ms'");
    await assert.rejects(b.query('SELECT id FROM finanzas_configuracion WHERE id=1 FOR UPDATE'), e => e.code === '55P03');
    await b.query('ROLLBACK'); await a.query('ROLLBACK');
    assert.equal((await b.query('SELECT id FROM finanzas_configuracion WHERE id=1')).rows.length, 1);
  } finally {
    await a.query('ROLLBACK'); await b.query('ROLLBACK');
    a.release(); b.release();
  }
});

test('U3B actual session service login/auth uses synthetic DB credentials only', async () => {
  const service = createSessionService(db, { secret: 'synthetic-test-only-session-key-u3b', issuer: 'u3b-test',
    audience: 'u3b-test', expiresIn: '10m' });
  const result = await service.login('synthu3b_doctor', seedPasswords.doctor);
  assert.equal(result.usuario.id, 'synthu3b_doctor');
  const auth = await service.authenticate(result.token);
  assert.equal(auth.user.id, 'synthu3b_doctor');
  await service.logout(auth.auth);
  await assert.rejects(service.authenticate(result.token));
});

async function login(id='synthu3b_admin') {
  const response=await fetch(base+'/api/auth/login',{method:'POST',headers:{
    Origin:base,'Content-Type':'application/json','x-micodent-client':'web',
  },body:JSON.stringify({id,password:id === 'synthu3b_doctor' ? seedPasswords.doctor : seedPasswords.admin})});
  assert.equal(response.status,200,'real HTTP login');
  const body=await response.json();
  assert.equal(body.ok,true);
  const cookie=response.headers.get('set-cookie').split(';')[0];
  return {Origin:base,'Content-Type':'application/json','x-micodent-client':'web',
    Cookie:cookie,'x-micodent-session':body.sesion.id,'x-csrf-token':body.sesion.csrf};
}
test('U3B real authenticated API smoke preserves routes, JSON and role restrictions', async () => {
  const headers=await login();
  for(const route of ['/api/auth/me','/api/usuarios','/api/usuarios/doctores','/api/pacientes',
    '/api/pacientes?search=ficticio&limit=5','/api/historias','/api/historias?search=ficticio&incluirArchivadas=true',
    '/api/historias/paciente/1','/api/citas?desde=2026-10-04&hasta=2026-10-04',
    '/api/dashboard/stats','/api/dashboard/deudores','/api/dashboard/financiero?desde=2026-10-04&hasta=2026-10-04',
    '/api/dashboard/produccion?desde=2026-10-04&hasta=2026-10-04',
    '/api/dashboard/produccion?desde=2026-10-04&hasta=2026-10-04&doctor=synthu3b_doctor',
    '/api/gastos','/api/gastos/penalidades','/api/laboratorio/trabajos?estado=pendiente',
    '/api/laboratorio/trabajos?estado=pagado','/api/auditoria-financiera']) {
    const response=await fetch(base+route,{headers});
    assert.equal(response.status,200,route);
    assert.equal((await response.json()).ok,true,route);
  }
  assert.equal((await fetch(base+'/api/pacientes')).status,401);
  const doctor=await login('synthu3b_doctor');
  assert.equal((await fetch(base+'/api/usuarios',{headers:doctor})).status,403);
});
test('U3B real patient CRUD keeps automatic history, Spanish search and logical deletion', async () => {
  const headers=await login();
  const body={dni:'00000003',nombres:'FICTICIO JOS\u00c9',apellidos:'PRUEBA MU\u00d1OZ',
    sexo:'M',fecha_nacimiento:'2000-01-01',domicilio:'SOLO PRUEBA',celular:'000000000'};
  let id;
  try {
    const create=await fetch(base+'/api/pacientes',{method:'POST',headers,body:JSON.stringify(body)});
    assert.equal(create.status,201);
    const created=await create.json(); id=created.id;
    assert.equal(typeof id,'number'); assert.ok(created.historiaId);
    const duplicate=await fetch(base+'/api/pacientes',{method:'POST',headers,body:JSON.stringify(body)});
    assert.equal(duplicate.status,400);
    const search=await fetch(base+'/api/pacientes?search=jose',{headers});
    assert.ok((await search.json()).data.some(p=>p.id===id));
    const update=await fetch(base+'/api/pacientes/'+id,{method:'PUT',headers,body:JSON.stringify({...body,domicilio:'FICTICIO ACTUALIZADO'})});
    assert.equal(update.status,200);
    const read=await fetch(base+'/api/pacientes/'+id,{headers});
    assert.equal((await read.json()).data.domicilio,'FICTICIO ACTUALIZADO');
    const removed=await fetch(base+'/api/pacientes/'+id,{method:'DELETE',headers});
    assert.equal(removed.status,200);
    const record=await native.query('SELECT activo FROM pacientes WHERE id=$1',[id]);
    assert.equal(record.rows[0].activo,false);
  } finally { if(id) await native.query('DELETE FROM pacientes WHERE id=$1',[id]); }
});
test('U3B real API permits only one of two concurrent overlapping appointments', async () => {
  const headers=await login();
  const body={nombre_contacto:'FICTICIO CONCURRENCIA AGENDA U3B2',celular_contacto:'000000000',
    doctor_id:'synthu3b_doctor',fecha:'2026-10-04',hora_inicio:'14:00',duracion_minutos:30};
  try {
    const responses=await Promise.all([1,2].map(()=>fetch(base+'/api/citas',
      {method:'POST',headers,body:JSON.stringify(body)})));
    assert.deepEqual(responses.map(r=>r.status).sort(),[201,409]);
    const count=await native.query('SELECT count(*) AS n FROM citas WHERE nombre_contacto=$1',[body.nombre_contacto]);
    assert.equal(Number(count.rows[0].n),1);
  } finally { await native.query('DELETE FROM citas WHERE nombre_contacto=$1',[body.nombre_contacto]); }
});
test('U3B real concurrent payment idempotency records one exact payment and commission', async () => {
  const key='synthetic_u3b2_payment_'+randomUUID();
  const headers={...await login(),'Idempotency-Key':key};
  try {
  const body={monto:'10.00',metodo_pago:'Efectivo'};
  const before=await native.query('SELECT count(*) AS n FROM pagos WHERE consulta_id=1');
  const responses=await Promise.all([1,2].map(()=>fetch(base+'/api/historias/consultas/1/pagos',
    {method:'POST',headers,body:JSON.stringify(body)})));
  assert.deepEqual(responses.map(r=>r.status).sort(),[200,201]);
  const results=await Promise.all(responses.map(r=>r.json()));
  assert.equal(results[0].pagoId,results[1].pagoId);
  const after=await native.query('SELECT count(*) AS n FROM pagos WHERE consulta_id=1');
  assert.equal(Number(after.rows[0].n),Number(before.rows[0].n)+1);
  const row=await native.query(`SELECT p.monto,p.comision_generada,f.margen_clinica FROM pagos p
    JOIN finanzas_pagos f ON f.pago_id=p.id WHERE p.consulta_id=1 ORDER BY p.id DESC LIMIT 1`);
  assert.deepEqual(row.rows[0],{monto:'10.00',comision_generada:'2.50',margen_clinica:'7.50'});
  } finally {
    // Delete only the payment owned by this run's unique synthetic request.
    const client=await native.connect();
    try {
      await client.query('BEGIN');
      const record=await client.query(`SELECT p.id,p.consulta_id,p.monto,p.registrado_por FROM finanzas_peticiones r
        JOIN pagos p ON p.id=(r.respuesta->>'pagoId')::bigint WHERE r.usuario_id=$1 AND r.clave=$2`,['synthu3b_admin',key]);
      if(record.rows.length) {
        const payment=record.rows[0];
        assert.equal(Number(payment.consulta_id),1);assert.equal(payment.monto,'10.00');
        assert.equal(payment.registrado_por,'synthu3b_admin');
        await client.query('DELETE FROM finanzas_pago_pos WHERE pago_id=$1',[payment.id]);
        await client.query('DELETE FROM finanzas_pagos WHERE pago_id=$1',[payment.id]);
        await client.query('DELETE FROM pagos WHERE id=$1',[payment.id]);
      }
      await client.query('DELETE FROM finanzas_peticiones WHERE usuario_id=$1 AND clave=$2',['synthu3b_admin',key]);
      await client.query('COMMIT');
    } catch(error) { await client.query('ROLLBACK');throw error; }
    finally {client.release();}
  }
});
test('U3B wall-clock date/time and bigint/Boolean serialization retain the API contract', async () => {
  const [rows]=await db.query('SELECT * FROM citas WHERE id=? FOR UPDATE',[1]).catch(error=>{
    assert.equal(error.code,'DB_TRANSACTION_REQUIRED'); return [[]];
  });
  assert.equal(rows.length,0);
  await db.transaction(async conn=>{
    const [[appointment]]=await conn.query('SELECT * FROM citas WHERE id=? FOR UPDATE',[1]);
    assert.equal(appointment.fecha,'2026-10-04');
    assert.equal(appointment.hora_inicio,'10:00:00');
    assert.equal(typeof appointment.id,'number');
  });
  const response=await fetch(base+'/api/citas?desde=2026-10-04&hasta=2026-10-04',{headers:await login()});
  const body=await response.json();
  assert.equal(response.status,200);
  assert.ok(body.data.some(row=>row.fecha==='2026-10-04' && row.hora_inicio==='10:00:00'));
  const [[user]]=await db.query('SELECT id, nombre_completo, prefix, especialidad FROM usuarios WHERE rol = \'Doctor\' AND activo = 1 ORDER BY nombre_completo ASC');
  assert.ok(user.id.startsWith('synthu3b_'));
});
