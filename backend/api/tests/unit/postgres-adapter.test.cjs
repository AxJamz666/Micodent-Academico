const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createDatabase } = require('../../src/db/factory');
const { statements, resolveQuery } = require('../../src/db/sqlCatalog');
const { databaseEngine, postgresOptions } = require('../../src/config/runtime');
const env = { APP_ENV: 'university', DB_HOST: 'db.invalid', DB_PORT: '5432',
  DB_NAME: 'synthetic_u3a', DB_USER: 'synthetic_u3a', DB_PASSWORD: '<synthetic>' };
const entry = id => statements.find(q => q.id === id);
const select = entry('U3A-138');
const insert = entry('U3A-139');
const update = entry('U3A-141');

test('U3A real multiline controller SQL matches cooked JavaScript strings on Windows', async () => {
  const f = fixture(), module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, '../../src/controllers/auth.controller.js'), 'utf8');
  vm.runInNewContext(source, { module, require(id) {
    if (id === '../config/db') return f.db;
    if (id === '../utils/securityError') return { sendSecurityError() { assert.fail('controller query was rejected'); } };
    return {};
  } });
  let response;
  await module.exports.getMe({ usuario: { id: 'synthetic' }, browserSession: 'synthetic' },
    { json(value) { response = value; } });
  assert.equal(response.ok, true);
  assert.equal(f.calls[0].text, entry('U3A-002').postgres);
  assert.deepEqual(Array.from(f.calls[0].values), ['synthetic']);
  assert.ok(!f.calls[0].text.includes('\r'));
});

function fixture() {
  const calls = [], releases = [], clients = [];
  let options, listener, connectError, queryError;
  let result = { command: 'SELECT', rows: [{ id: 1 }], rowCount: 1, fields: [] };
  const query = async (owner, text, values) => {
    calls.push({ owner, text, values });
    if (queryError) throw queryError;
    return result;
  };
  class Pool extends EventEmitter {
    constructor(value) { super(); options = value; }
    on(name, handler) { listener = handler; return super.on(name, handler); }
    query(text, values) { return query('pool', text, values); }
    async connect() {
      if (connectError) throw connectError;
      const owner = 'client-' + clients.length;
      const client = { query: (text, values) => query(owner, text, values),
        release: error => releases.push({ owner, error }) };
      clients.push(client);
      return client;
    }
    async end() { calls.push({ owner: 'pool', text: 'END_POOL' }); }
  }
  const pg = { Pool, types: { getTypeParser: oid => value => ({ oid, value }) } };
  const db = createDatabase('postgres', postgresOptions(env), { pg });
  return { db, calls, releases, clients, options: () => options, listener: () => listener,
    result(value) { result = value; }, error(value) { queryError = value; },
    connectError(value) { connectError = value; } };
}

test('U3A engine selection is centralized and university never falls back to MySQL', () => {
  assert.equal(databaseEngine({}), 'mysql');
  assert.equal(databaseEngine({ APP_ENV: 'university' }), 'postgres');
  assert.equal(databaseEngine({ DB_ENGINE: 'postgres' }), 'postgres');
  for (const DB_ENGINE of ['pg', '', 'POSTGRES', 'sqlite']) {
    if (DB_ENGINE) assert.throws(() => databaseEngine({ DB_ENGINE }), /DB_ENGINE_INVALID/);
  }
  assert.throws(() => databaseEngine({ APP_ENV: 'university', DB_ENGINE: 'mysql' }), /UNIVERSITY_DB_ENGINE_INVALID/);
  assert.throws(() => createDatabase('other', {}), /DB_ENGINE_INVALID/);
});

test('U3A pg Pool uses standard DB keys and explicit certificate-verifying TLS only', () => {
  const f = fixture(), config = f.options();
  assert.equal(config.host, env.DB_HOST); assert.equal(config.port, 5432);
  assert.equal(config.database, env.DB_NAME); assert.equal(config.user, env.DB_USER);
  assert.equal(config.password, env.DB_PASSWORD); assert.equal(config.ssl, false);
  assert.equal(config.max, 10); assert.equal(config.connectionTimeoutMillis, 10000);
  assert.equal(typeof f.listener(), 'function');
  assert.deepEqual(postgresOptions({ ...env, DB_SSL_MODE: 'require', DB_SSL_CA: '<synthetic-ca>' }).ssl,
    { rejectUnauthorized: true, ca: '<synthetic-ca>' });
  assert.throws(() => postgresOptions({ ...env, DB_SSL_MODE: 'verify-no' }), /DB_SSL_MODE_INVALID/);
  assert.throws(() => postgresOptions({ ...env, DB_SSL_CA: '<synthetic-ca>' }), /DB_SSL_CA_WITHOUT_TLS/);
});

test('U3A date parsers are local to the pool, numeric and bytea defaults remain intact', () => {
  const f = fixture(), types = f.options().types;
  for (const oid of [1082, 1114, 1184]) assert.equal(types.getTypeParser(oid, 'text')('2026-10-04'), '2026-10-04');
  assert.deepEqual(types.getTypeParser(1700, 'text')('12.35'), { oid: 1700, value: '12.35' });
  assert.deepEqual(types.getTypeParser(1082, 'binary')('binary'), { oid: 1082, value: 'binary' });
});

test('U3A every reviewed catalog entry has exact sequential binds and nonconflicting duplicate mappings', () => {
  const seen = new Map();
  for (const q of statements) {
    const values = Array.from({ length: q.parameters }, (_, i) => 'synthetic-' + i);
    assert.deepEqual(resolveQuery(q.mysql, values), { text: q.postgres, values, lock: q.lock,
      ...(q.sessionLock ? { sessionLock: q.sessionLock } : {}) }, q.id);
    const binds = [...q.postgres.matchAll(/\$(\d+)/g)].map(m => Number(m[1]));
    assert.deepEqual(binds, Array.from({ length: q.parameters }, (_, i) => i + 1), q.id);
    if (seen.has(q.mysql)) assert.equal(seen.get(q.mysql), q.postgres, q.id);
    seen.set(q.mysql, q.postgres);
    assert.ok(!q.postgres.includes('?'), q.id);
  }
});

test('U3A SELECT and execute normalize rows without coercing money, binary hashes or nulls', async () => {
  const f = fixture(), tokenHash = Buffer.alloc(32, 7);
  const rows = [{ id: 1, monto: '9007199254740993.27', token_hash: tokenHash, anulada_en: null }];
  f.result({ command: 'SELECT', rows, rowCount: 1, fields: [{ name: 'id' }] });
  assert.deepEqual(await f.db.query(select.mysql, ['synthetic']), [rows, [{ name: 'id' }]]);
  assert.deepEqual(await f.db.execute(select.mysql, ['synthetic']), [rows, [{ name: 'id' }]]);
  assert.equal(f.calls[0].owner, 'pool');
  assert.equal(f.calls[0].text, 'SELECT id FROM pacientes WHERE dni = $1');
});

test('U3A INSERT RETURNING and UPDATE rowCount preserve the legacy write contract', async () => {
  const f = fixture();
  f.result({ command: 'INSERT', rows: [{ id: '42' }], rowCount: 1 });
  assert.equal((await f.db.execute(insert.mysql, Array(insert.parameters).fill(null)))[0].insertId, 42);
  assert.match(f.calls[0].text, /RETURNING id$/);
  f.result({ command: 'UPDATE', rows: [], rowCount: 0 });
  assert.deepEqual((await f.db.query(update.mysql, ['synthetic', 42]))[0], { affectedRows: 0 });
  f.result({ command: 'INSERT', rows: [{ id: '9007199254740993' }], rowCount: 1 });
  assert.equal((await f.db.query(insert.mysql, Array(insert.parameters).fill(null)))[0].insertId, '9007199254740993');
});

test('U3A unsafe or unregistered SQL and malformed binds fail before contacting the driver', async () => {
  const f = fixture();
  for (const sql of ['SELECT ? AS unreviewed', 'SELECT GET_LOCK(?,10)', select.mysql + '; DROP TABLE pacientes']) {
    await assert.rejects(f.db.query(sql, [1]), error => error.code === 'SCHEMA_PENDING');
  }
  for (const values of [[], [1, 2], [undefined], Array(1), { id: 1 }]) {
    await assert.rejects(f.db.query(select.mysql, values), /DB_PARAMETERS_INVALID/);
  }
  assert.equal(f.calls.length, 0);
});

test('U3A parameter values including SQL-looking strings are never interpolated', async () => {
  const f = fixture(), value = "x' OR 1=1 --";
  await f.db.query(select.mysql, [value]);
  assert.deepEqual(f.calls[0].values, [value]);
  assert.ok(!f.calls[0].text.includes(value));
  const q = entry('U3A-204'), hash = Buffer.alloc(32, 9);
  await f.db.execute(q.mysql, [hash]);
  assert.equal(f.calls[1].values[0], hash);
});

test('U3A aliases and shared row locks have explicit PostgreSQL spellings', async () => {
  assert.match(entry('U3A-033').postgres, /AS "ingresosHoy"/);
  assert.match(entry('U3A-034').postgres, /AS "sinHistoria"/);
  assert.match(entry('U3A-042').postgres, /AS "costoLaboratorioPagado"/);
  assert.match(entry('U3A-195').postgres, /FOR SHARE$/);
  const f = fixture(), lock = entry('U3A-195');
  await assert.rejects(f.db.query(lock.mysql, ['synthetic']), /DB_TRANSACTION_REQUIRED/);
  assert.equal(f.calls.length, 0);
  await f.db.transaction(conn => conn.query(lock.mysql, ['synthetic']));
  assert.deepEqual(f.calls.map(c => c.text), ['BEGIN', lock.postgres, 'COMMIT']);
});

test('U3A transaction commit uses one acquired client and releases it once', async () => {
  const f = fixture();
  const result = await f.db.transaction(async conn => {
    await conn.query(select.mysql, ['synthetic']);
    await conn.execute(update.mysql, ['synthetic', 1]);
    return 9;
  });
  assert.equal(result, 9);
  assert.ok(f.calls.every(call => call.owner === 'client-0'));
  assert.deepEqual(f.calls.map(c => c.text), ['BEGIN', select.postgres, update.postgres, 'COMMIT']);
  assert.equal(f.releases.length, 1); assert.equal(f.releases[0].error, undefined);
});

test('U3A failed work rolls back same client and preserves the application error', async () => {
  const f = fixture(), error = new Error('SYNTHETIC_VALIDATION');
  await assert.rejects(f.db.transaction(async conn => {
    await conn.query(select.mysql, ['synthetic']);
    throw error;
  }), actual => actual === error);
  assert.deepEqual(f.calls.map(c => c.text), ['BEGIN', select.postgres, 'ROLLBACK']);
  assert.ok(f.calls.every(c => c.owner === 'client-0'));
  assert.equal(f.releases.length, 1);
});

test('U3A next-transaction READ ONLY becomes BEGIN READ ONLY on the same client', async () => {
  const f = fixture(), conn = await f.db.getConnection();
  await conn.query('SET TRANSACTION READ ONLY');
  assert.equal(f.calls.length, 0);
  await conn.beginTransaction();
  await conn.query(select.mysql, ['synthetic']);
  await assert.rejects(conn.query('SET TRANSACTION READ ONLY'), /DB_TRANSACTION_STATE/);
  await conn.commit(); await conn.beginTransaction(); await conn.rollback();
  conn.release();
  assert.deepEqual(f.calls.map(c => c.text), ['BEGIN READ ONLY', select.postgres, 'COMMIT', 'BEGIN', 'ROLLBACK']);
});

test('U3A released and dirty clients cannot reenter the pool unnoticed', async () => {
  const f = fixture(), conn = await f.db.getConnection();
  await conn.beginTransaction(); conn.release(); conn.release();
  assert.equal(f.releases.length, 1); assert.equal(f.releases[0].error.code, 'DB_CLIENT_UNCERTAIN');
  await assert.rejects(conn.query(select.mysql, ['synthetic']), /DB_CLIENT_RELEASED/);
  await assert.rejects(conn.beginTransaction(), /DB_TRANSACTION_STATE/);
});

test('U3A driver failures are sanitized and mapped without passwords, SQL or connection strings', async () => {
  for (const [code, expected] of [['23505','ER_DUP_ENTRY'], ['23503','ER_NO_REFERENCED_ROW_2'],
    ['40P01','ER_LOCK_DEADLOCK'], ['40001','ER_LOCK_DEADLOCK'], ['55P03','ER_LOCK_WAIT_TIMEOUT'],
    ['42P01','ER_NO_SUCH_TABLE'], ['42703','ER_BAD_FIELD_ERROR'], ['ECONNREFUSED','ECONNREFUSED'],
    ['unknown-private','DB_OPERATION_FAILED']]) {
    const f = fixture();
    f.error(Object.assign(new Error('<synthetic-password-and-SQL>'), { code, detail: 'private' }));
    await assert.rejects(f.db.query(select.mysql, ['synthetic']), error => {
      assert.equal(error.code, expected);
      assert.equal(error.message, expected);
      assert.ok(!JSON.stringify(error).includes('private'));
      assert.equal(error.cause, undefined);
      return true;
    });
  }
});

test('U3A rollback failure discards client and keeps original exception', async () => {
  const f = fixture(), original = new Error('SYNTHETIC_APPLICATION');
  await assert.rejects(f.db.transaction(async () => {
    f.error(new Error('SYNTHETIC_ROLLBACK_FAILURE')); throw original;
  }), error => error === original);
  assert.equal(f.releases[0].error.code, 'DB_CLIENT_UNCERTAIN');
  assert.equal(f.calls.at(-1).text, 'ROLLBACK');
});

test('U3A unavailable pool acquisition rejects without leaking driver details', async () => {
  const f = fixture();
  f.connectError(Object.assign(new Error('private connection detail'), { code: 'ECONNREFUSED' }));
  await assert.rejects(f.db.getConnection(), error => error.message === 'ECONNREFUSED');
  assert.equal(f.clients.length, 0);
  await f.db.end(); assert.equal(f.calls.at(-1).text, 'END_POOL');
});

test('U3B schema readiness and PostgreSQL limiter fail closed on missing schema', async () => {
  const f = fixture();
  await assert.rejects(f.db.assertApplicationReady(), error => error.code === 'SCHEMA_PENDING');
  f.error(Object.assign(new Error('private'), { code: '42P01' }));
  await assert.rejects(f.db.createAuthenticationLimiter({ keyPrefix: 'synthetic', points: 1 }).consume('synthetic'), /ER_NO_SUCH_TABLE/);
  assert.ok(f.calls.length > 0);
});

test('U3A failed transaction cannot commit or query before rollback', async () => {
  const f = fixture(), conn = await f.db.getConnection();
  await conn.beginTransaction();
  f.error(Object.assign(new Error('private'), { code: '40P01' }));
  await assert.rejects(conn.execute(update.mysql, ['synthetic', 1]), /ER_LOCK_DEADLOCK/);
  await assert.rejects(conn.commit(), /DB_TRANSACTION_STATE/);
  await assert.rejects(conn.query(select.mysql, ['synthetic']), /DB_TRANSACTION_FAILED/);
  f.error(null);
  await conn.rollback(); conn.release();
  assert.equal(f.calls.at(-1).text, 'ROLLBACK');
  assert.equal(f.releases[0].error, undefined);
});

test('U3A actual installed pg constructor and local types need no server connection', async () => {
  const db = createDatabase('postgres', postgresOptions(env));
  await db.end();
});

test('U3A each registered statement actually reaches the mock pg client with bounded values', async () => {
  for (const q of statements) {
    const f = fixture();
    const values = Array(q.parameters).fill('synthetic');
    if (q.sessionLock) {
      f.result({ command: 'SELECT', rows: [{ acquired: 1, released: 1 }], rowCount: 1 });
      const conn = await f.db.getConnection();
      await conn.execute(q.mysql, values);
      conn.release();
    } else if (q.lock) await f.db.transaction(conn => conn.execute(q.mysql, values));
    else await f.db.execute(q.mysql, values);
    const call = f.calls.find(c => c.text === q.postgres);
    assert.ok(call, q.id);
    assert.deepEqual(call.values, values, q.id);
  }
});

test('U3A MySQL comparison keeps native pool, execute shape and existing limiter store', async () => {
  const calls = [], releases = [];
  const conn = { async beginTransaction() { calls.push('BEGIN'); },
    async commit() { calls.push('COMMIT'); }, async rollback() { calls.push('ROLLBACK'); },
    release() { releases.push('release'); }, destroy() { releases.push('destroy'); } };
  const native = { pool: {}, async query() { return [[{ id: 7 }], []]; },
    async execute() { return [{ insertId: 7, affectedRows: 1 }, []]; }, async getConnection() { return conn; } };
  let settings;
  const db = createDatabase('mysql', { host: '127.0.0.1' }, { mysql: { createPool(options) { settings = options; return native; } } });
  assert.equal(db, native); assert.equal(db.pool, native.pool);
  assert.equal(settings.dateStrings, true); assert.equal(settings.timezone, '-05:00');
  assert.equal((await db.execute())[0].insertId, 7);
  await db.transaction(async client => { assert.equal(client, conn); });
  await assert.rejects(db.transaction(async () => { throw new Error('SYNTHETIC'); }), /SYNTHETIC/);
  assert.deepEqual(calls, ['BEGIN', 'COMMIT', 'BEGIN', 'ROLLBACK']);
  assert.deepEqual(releases, ['release', 'release']);
});
