const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const express = require('express');
const { once } = require('node:events');
const { runtimeOptions, databaseSettings } = require('../../src/config/runtime');

test('U2 runtime preserves local defaults and explicitly binds the university profile', () => {
  assert.deepEqual(runtimeOptions({}), { profile: 'development', host: '127.0.0.1', port: 4000 });
  assert.deepEqual(runtimeOptions({ APP_ENV: 'university', PORT: '3041', HOST: '0.0.0.0' }),
    { profile: 'university', host: '0.0.0.0', port: 3041 });
  assert.equal(runtimeOptions({ APP_ENV: 'university' }).port, 3000);
});

test('U2 runtime fails closed on malformed ports, hosts and profiles', () => {
  for (const PORT of ['0', '65536', '-1', '3000x', ' 3000', '3.5']) {
    assert.throws(() => runtimeOptions({ PORT }), /APP_PORT_INVALID/);
  }
  assert.throws(() => runtimeOptions({ APP_ENV: 'other' }), /APP_ENV_INVALID/);
  assert.throws(() => runtimeOptions({ HOST: '0.0.0.0' }), /APP_HOST_INVALID/);
  assert.throws(() => runtimeOptions({ APP_ENV: 'university', HOST: 'localhost' }), /APP_HOST_INVALID/);
});

const synthetic = { DB_HOST: 'db.invalid', DB_PORT: '5432', DB_NAME: 'synthetic_university',
  DB_USER: 'synthetic_user', DB_PASSWORD: '<synthetic>' };
test('U2 standard database normalization is driver-neutral and validates all keys', () => {
  assert.deepEqual(databaseSettings(synthetic), { host: 'db.invalid', port: 5432,
    database: synthetic.DB_NAME, user: synthetic.DB_USER, password: synthetic.DB_PASSWORD });
  for (const key of Object.keys(synthetic)) {
    const env = { ...synthetic }; delete env[key];
    assert.throws(() => databaseSettings(env));
  }
  assert.throws(() => databaseSettings({ ...synthetic, DB_PORT: '0' }), /DB_PORT_INVALID/);
  assert.throws(() => databaseSettings({ ...synthetic, DB_NAME: 'bad name' }), /DB_ENV_INCOMPLETE/);
});

function environment(env) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../src/config/environment.js'), 'utf8'), {
    module, Buffer, __dirname, process: { env },
    require(id) {
      if (id === 'dotenv') return { config() {} };
      if (id === './runtime') return {
        applicationProfile: () => require('../../src/config/runtime').applicationProfile(env),
        databaseSettings: () => databaseSettings(env),
        databaseEngine: () => require('../../src/config/runtime').databaseEngine(env),
        postgresOptions: () => require('../../src/config/runtime').postgresOptions(env),
      };
      if (id === 'node:path') return path;
      throw new Error('UNEXPECTED_IMPORT');
    },
  });
  return module.exports;
}

test('U2 university DB cannot fall through to mysql2; local DEV guard is unchanged', () => {
  const pgOptions = environment({ ...synthetic, APP_ENV: 'university' }).databaseOptions();
  assert.equal(pgOptions.port, 5432);
  assert.equal(pgOptions.ssl, false);
  assert.ok(!('timezone' in pgOptions));
  assert.throws(() => environment({ ...synthetic, APP_ENV: 'university', DB_ENGINE: 'mysql' }).databaseOptions(),
    /UNIVERSITY_DB_ENGINE_INVALID/);
  const dev = { ...synthetic, DB_HOST: '127.0.0.1', DB_PORT: '1',
    DB_NAME: 'micodent_dev', DB_USER: 'dev_micodent' };
  assert.equal(environment(dev).databaseOptions().port, 1);
  for (const override of [{ DB_HOST: 'db.invalid' }, { DB_NAME: 'micodent' }, { DB_USER: 'root' }]) {
    assert.throws(() => environment({ ...dev, ...override }).databaseOptions(), /S1A_DEV_DATABASE_GUARD/);
  }
});

function healthApp(failure, guard = false) {
  const module = { exports: {} };
  const queries = [];
  const db = { async query(sql) {
    queries.push(sql);
    if (failure) throw Object.assign(new Error('synthetic-private-detail'), { code: failure });
    if (sql.includes('SELECT version')) return [[{ version: '001' }, { version: '002' }]];
    if (sql.includes('SELECT revision')) return [[{ revision: 1 }]];
    return [[]];
  } };
  if (guard) db.assertApplicationReady = () => {
    throw Object.assign(new Error('SCHEMA_PENDING'), { code: 'SCHEMA_PENDING' });
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../src/index.js'), 'utf8'), {
    module, __dirname: path.join(__dirname, '../../src'), process: { env: {} }, console: { error() {} },
    require(id) {
      if (id === 'express') return express;
      if (id === 'cors') return require('cors');
      if (id === 'node:path') return path;
      if (id === './config/runtime') return { runtimeOptions: () => runtimeOptions({ APP_ENV: 'university' }) };
      if (id === './config/db') return db;
      if (id === './config/browserTransport') return { origins: [], boundary: (_req, _res, next) => next() };
      if (id.startsWith('./routes/')) return express.Router();
      if (id.startsWith('../scripts/migrate-')) return { async verifyApplied() {} };
      throw new Error('UNEXPECTED_IMPORT');
    },
  });
  return { app: module.exports, queries };
}

async function withServer(fixture, run) {
  const server = fixture.app.listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    await run('http://127.0.0.1:' + server.address().port);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}

test('U2 /health aliases existing readiness unauthenticated, not SPA or liveness', async () => {
  const f = healthApp();
  await withServer(f, async base => {
    for (const route of ['/health', '/api/health']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const body = await response.json();
      assert.equal(body.status, 'healthy');
      assert.equal(body.database, 'connected');
      assert.ok(!JSON.stringify(body).includes('synthetic-private-detail'));
    }
    assert.ok(f.queries.length >= 16, 'both aliases check schema, not just SELECT 1');
  });
});

test('U2 /health rejects missing schema and unavailable DB without disclosing errors', async () => {
  for (const code of ['SCHEMA_PENDING', 'ECONNREFUSED']) {
    await withServer(healthApp(code), async base => {
      const response = await fetch(base + '/health');
      assert.equal(response.status, 503);
      const body = await response.json();
      assert.equal(body.ok, false);
      assert.equal(body.reason, code === 'SCHEMA_PENDING' ? 'schema_pending' : 'database_unavailable');
      assert.ok(!JSON.stringify(body).includes('synthetic-private-detail'));
    });
  }
});

test('U3A /health stays 503 before any MySQL schema verifier or query can run', async () => {
  const f = healthApp(null, true);
  await withServer(f, async base => {
    const response = await fetch(base + '/health');
    assert.equal(response.status, 503);
    assert.equal((await response.json()).reason, 'schema_pending');
    assert.equal(f.queries.length, 0);
  });
});
