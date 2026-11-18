const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { randomUUID } = require('node:crypto');
const { Pool } = require('pg');
const { settings, verifyIdentity, labSeedPasswords } = require('../../scripts/postgres-u3b-safety.cjs');

const config = settings(process.env, 'app');
const passwords = labSeedPasswords(process.env);
let pool, apiDb, server, base;
test.before(async () => {
  pool = new Pool(config);
  await verifyIdentity(pool, config);
  process.env.JWT_SECRET = 'synthetic-test-only-session-key-u3b';
  process.env.PORT = '3000';
  const app = require('../../src/index');
  apiDb = require('../../src/config/db');
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  await apiDb?.end();
  await pool?.end();
});


test('APO-02 stock persists, threshold is exact, retries are idempotent and concurrent exits cannot overdraw', async () => {
  const auth = await fetch(base + '/api/auth/login', {
    method:'POST', headers:{Origin:base,'Content-Type':'application/json','x-micodent-client':'web'},
    body:JSON.stringify({id:'synthu3b_admin',password:passwords.admin}),
  });
  assert.equal(auth.status,200);
  const session=await auth.json();
  const headers={Origin:base,'Content-Type':'application/json','x-micodent-client':'web',
    Cookie:auth.headers.get('set-cookie').split(';')[0],
    'x-micodent-session':session.sesion.id,'x-csrf-token':session.sesion.csrf};
  async function post(url,body,key=randomUUID()) {
    const response=await fetch(base+'/api/insumos'+url,{method:'POST',headers:{...headers,'Idempotency-Key':key},body:JSON.stringify(body)});
    return {status:response.status,body:await response.json()};
  }
  assert.equal((await fetch(base+'/api/insumos')).status,401);
  const made=await post('',{nombre:'Insumo de prueba '+randomUUID(),unidad:'unidad',minimo:5});
  assert.equal(made.status,201,JSON.stringify(made.body));
  const id=made.body.data.id;
  assert.ok(id);
  const url='/'+id+'/operaciones';
  const key=randomUUID();
  const movement={tipo:'entrada',cantidad:10,motivo:'Ingreso ficticio verificable'};
  const first=await post(url,movement,key);
  assert.equal(first.status,201,JSON.stringify(first.body));
  const repeat=await post(url,movement,key);
  assert.equal(repeat.status,200);
  assert.deepEqual(repeat.body,first.body);
  assert.equal((await post(url,{...movement,cantidad:11},key)).status,409);
  const exits=await Promise.all([post(url,{tipo:'salida',cantidad:6,motivo:'Consumo A'}),post(url,{tipo:'salida',cantidad:6,motivo:'Consumo B'})]);
  assert.deepEqual(exits.map(x=>x.status).sort(),[201,409]);
  assert.equal((await pool.query('SELECT stock FROM insumos WHERE id=$1',[id])).rows[0].stock,4);
  await post(url,{tipo:'entrada',cantidad:1,motivo:'Umbral exacto'});
  const item=(await pool.query('SELECT * FROM insumos WHERE id=$1',[id])).rows[0];
  assert.equal(item.stock,item.minimo);
  const requestKey=randomUUID();
  const request={tipo:'reposicion',cantidad:15,motivo:'Solicitud por stock mínimo'};
  assert.equal((await post(url,request,requestKey)).status,201);
  assert.equal((await post(url,request,requestKey)).status,200);
  const invalid=await post(url,{tipo:'salida',cantidad:-1,motivo:'Inválido'});
  assert.equal(invalid.status,400);
  assert.equal((await pool.query('SELECT stock FROM insumos WHERE id=$1',[id])).rows[0].stock,5);
  const history=await fetch(base+'/api/insumos/'+id+'/operaciones',{headers});
  assert.equal(history.status,200);
  assert.equal((await history.json()).data.length,4);
  const doctorLogin=await fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json','x-micodent-client':'web'},body:JSON.stringify({id:'synthu3b_doctor',password:passwords.doctor})});
  const doctor=await doctorLogin.json();
  const forbidden=await fetch(base+'/api/insumos',{headers:{...headers,Cookie:doctorLogin.headers.get('set-cookie').split(';')[0],'x-micodent-session':doctor.sesion.id,'x-csrf-token':doctor.sesion.csrf}});
  assert.equal(forbidden.status,403);
});
