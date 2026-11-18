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

test('TC-025 preserves historical commissions and rolls back every repeated reconciliation', async t => {
  const key = 'jose_conciliacion_' + randomUUID();
  const secondKey = 'jose_conciliacion_' + randomUUID();
  const actor = 'synthu3b_admin';
  const auth = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { Origin: base, 'Content-Type': 'application/json', 'x-micodent-client': 'web' },
    body: JSON.stringify({ id: actor, password: passwords.admin }),
  });
  assert.equal(auth.status, 200);
  const session = await auth.json();
  const headers = {
    Origin: base, 'Content-Type': 'application/json', 'x-micodent-client': 'web',
    Cookie: auth.headers.get('set-cookie').split(';')[0],
    'x-micodent-session': session.sesion.id, 'x-csrf-token': session.sesion.csrf,
  };
  let consultaId;
  async function snapshot() {
    const payments = await pool.query('SELECT * FROM pagos WHERE consulta_id=$1 ORDER BY id', [consultaId]);
    const financial = await pool.query('SELECT f.* FROM finanzas_pagos f JOIN pagos p ON p.id=f.pago_id WHERE p.consulta_id=$1 ORDER BY f.pago_id', [consultaId]);
    const costs = await pool.query('SELECT * FROM finanzas_costos WHERE consulta_id=$1', [consultaId]);
    const audit = await pool.query("SELECT * FROM auditoria_financiera WHERE usuario_id=$1 AND detalle_json->>'consulta_id'=$2 ORDER BY id", [actor, String(consultaId)]);
    const requests = await pool.query('SELECT * FROM finanzas_peticiones WHERE usuario_id=$1 AND clave=ANY($2::text[]) ORDER BY clave', [actor, [key, secondKey]]);
    return { payments: payments.rows, financial: financial.rows, costs: costs.rows, audit: audit.rows, requests: requests.rows };
  }
  const body = JSON.stringify({ costo_cubierto: '100.00', motivo: 'Conciliacion sintetica TC-025 Jose' });
  async function reconcile(requestKey) {
    const response = await fetch(base + '/api/historias/consultas/' + consultaId + '/conciliar-costos', {
      method: 'POST', headers: { ...headers, 'Idempotency-Key': requestKey }, body,
    });
    return { status: response.status, body: await response.json() };
  }
  try {
    const created = await pool.query("INSERT INTO consultas(historia_id,descripcion,costo_total,fecha_consulta,doctor_id) VALUES(1,$1,180.00,CURRENT_DATE,'synthu3b_doctor') RETURNING id", [key]);
    consultaId = created.rows[0].id;
    await pool.query("INSERT INTO finanzas_costos VALUES($1,100.00,'legacy_pendiente')", [consultaId]);
    for (const [amount, commission] of [['100.00', '20.00'], ['80.00', '12.00']]) {
      const payment = await pool.query("INSERT INTO pagos(consulta_id,monto,comision_generada,fecha_pago,hora_pago,registrado_por) VALUES($1,$2,$3,CURRENT_DATE,LOCALTIME,$4) RETURNING id", [consultaId, amount, commission, actor]);
      await pool.query("INSERT INTO finanzas_pagos(pago_id,doctor_id,costo_aplicado,base_comisionable,margen_clinica,regla) VALUES($1,'synthu3b_doctor',0,$2,$2::numeric-$3::numeric,'legacy_pendiente')", [payment.rows[0].id, amount, commission]);
    }
    const before = await snapshot();
    let first;
    let after;
    await t.test('201 assigns costs chronologically and preserves original payments', async () => {
      first = await reconcile(key);
      assert.equal(first.status, 201, JSON.stringify(first.body));
      assert.equal(first.body.ok, true);
      after = await snapshot();
      assert.deepEqual(after.payments, before.payments);
      assert.deepEqual(after.financial.map(row => [row.costo_aplicado, row.base_comisionable, row.margen_clinica, row.regla]), [
        ['80.00', '20.00', '0.00', 'legacy_conciliado'],
        ['20.00', '60.00', '48.00', 'legacy_conciliado'],
      ]);
      assert.deepEqual(after.payments.map(row => row.comision_generada), ['20.00', '12.00']);
      assert.equal(after.costs[0].origen, 'legacy_conciliado');
      assert.equal(after.audit.length, 1);
      assert.equal(after.audit[0].modulo, 'conciliacion');
      assert.equal(after.requests.length, 1);
      assert.equal(after.requests[0].clave, key);
    });
    await t.test('200 replays the saved response with an identical persistent snapshot', async () => {
      const repeated = await reconcile(key);
      assert.equal(repeated.status, 200);
      assert.deepEqual(repeated.body, first.body);
      assert.deepEqual(await snapshot(), after);
    });
    await t.test('409 with a new key rolls back the provisional request and every other write', async () => {
      const conflict = await reconcile(secondKey);
      assert.equal(conflict.status, 409);
      assert.equal(conflict.body.ok, false);
      assert.deepEqual(await snapshot(), after);
    });
  } finally {
    if (consultaId) {
      await pool.query("DELETE FROM auditoria_financiera WHERE usuario_id=$1 AND detalle_json->>'consulta_id'=$2", [actor, String(consultaId)]);
      await pool.query('DELETE FROM finanzas_pagos WHERE pago_id IN (SELECT id FROM pagos WHERE consulta_id=$1)', [consultaId]);
      await pool.query('DELETE FROM pagos WHERE consulta_id=$1', [consultaId]);
      await pool.query('DELETE FROM finanzas_costos WHERE consulta_id=$1', [consultaId]);
      await pool.query('DELETE FROM consultas WHERE id=$1', [consultaId]);
    }
    await pool.query('DELETE FROM finanzas_peticiones WHERE usuario_id=$1 AND clave=ANY($2::text[])', [actor, [key, secondKey]]);
    await fetch(base + '/api/auth/logout', { method: 'POST', headers, body: '{}' });
  }
});
