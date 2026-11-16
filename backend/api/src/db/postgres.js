const { resolveQuery } = require('./sqlCatalog');
const { verifySchema } = require('./postgresSchema');
const { setTimeout: delay } = require('node:timers/promises');

function failure(code) {
  return Object.assign(new Error(code), { code });
}

function sanitize(error) {
  const codes = { '23505': 'ER_DUP_ENTRY', '23503': 'ER_NO_REFERENCED_ROW_2', 'SCHEMA_PENDING': 'SCHEMA_PENDING',
    '40P01': 'ER_LOCK_DEADLOCK', '40001': 'ER_LOCK_DEADLOCK',
    '55P03': 'ER_LOCK_WAIT_TIMEOUT', '42P01': 'ER_NO_SUCH_TABLE', '42703': 'ER_BAD_FIELD_ERROR' };
  const connectivity = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EPIPE'];
  return failure(codes[error?.code] || (connectivity.includes(error?.code) ? error.code : 'DB_OPERATION_FAILED'));
}

function normalized(result) {
  if (result.command === 'SELECT') return [result.rows, result.fields || []];
  const id = result.rows?.[0]?.id;
  // Preserve large identities without loss of precision; never parse NUMERIC values.
  const insertId = typeof id === 'string' && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) ? Number(id) : id;
  return [{ affectedRows: result.rowCount, ...(result.command === 'INSERT' && id !== undefined ? { insertId } : {}) },
    result.fields || []];
}

function createPostgres(pg, options) {
  const dates = new Set([1082, 1114, 1184]);
  const pool = new pg.Pool({ ...options, types: {
    getTypeParser(oid, format) {
      if (Number(oid) === 20 && format !== 'binary') return value =>
        Number.isSafeInteger(Number(value)) ? Number(value) : value;
      if (Number(oid) === 16 && format !== 'binary') return value => value === 't' ? 1 : 0;
      return dates.has(Number(oid)) && format !== 'binary' ? value => value : pg.types.getTypeParser(oid, format);
    },
  } });
  // Idle errors must be handled without disclosing SQL or driver details.
  pool.on('error', () => console.error('POSTGRES_IDLE_CONNECTION_FAILED'));

  async function run(target, sql, params, inTransaction = false) {
    const query = resolveQuery(sql, params);
    if (query.lock && !inTransaction) throw failure('DB_TRANSACTION_REQUIRED');
    if (query.sessionLock && target === pool) throw failure('DB_CONNECTION_REQUIRED');
    try {
      if (query.sessionLock === 'acquire') {
        const deadline = Date.now() + 10000;
        while (true) {
          const result = await target.query(query.text, query.values);
          if (result.rows[0].acquired || Date.now() >= deadline) return normalized(result);
          await delay(25);
        }
      }
      return normalized(await target.query(query.text, query.values));
    }
    catch (error) { throw sanitize(error); }
  }

  async function getConnection() {
    let client;
    try { client = await pool.connect(); } catch (error) { throw sanitize(error); }
    let state = 'idle', readOnly = false, broken = false;
    const check = () => { if (state === 'released') throw failure('DB_CLIENT_RELEASED'); };
    async function command(sql, nextState) {
      check();
      try { await client.query(sql); state = nextState; }
      catch (error) { state = 'failed'; broken = true; throw sanitize(error); }
    }
    const conn = {
      async query(sql, params = []) {
        check();
        if (sql === 'SET TRANSACTION READ ONLY') {
          if (state !== 'idle' || params.length) throw failure('DB_TRANSACTION_STATE');
          readOnly = true;
          return [{ affectedRows: 0 }, []];
        }
        if (state === 'failed') throw failure('DB_TRANSACTION_FAILED');
        try { return await run(client, sql, params, state === 'active'); }
        catch (error) {
          if (state === 'active') {
            state = 'failed';
          }
          throw error;
        }
      },
      async beginTransaction() {
        if (state !== 'idle') throw failure('DB_TRANSACTION_STATE');
        await command(readOnly ? 'BEGIN READ ONLY' : 'BEGIN', 'active');
        readOnly = false;
      },
      async commit() {
        if (state !== 'active') throw failure('DB_TRANSACTION_STATE');
        await command('COMMIT', 'idle');
      },
      async rollback() {
        check();
        readOnly = false;
        if (state !== 'idle') await command('ROLLBACK', 'idle');
      },
      release() {
        if (state === 'released') return;
        const discard = broken || state !== 'idle';
        state = 'released';
        client.release(discard ? failure('DB_CLIENT_UNCERTAIN') : undefined);
      },
      destroy() {
        if (state === 'released') return;
        state = 'released';
        client.release(failure('DB_CLIENT_DESTROYED'));
      },
    };
    conn.execute = conn.query;
    return conn;
  }

  const adapter = {
    query: (sql, params = []) => run(pool, sql, params),
    getConnection,
    async transaction(work) {
      const conn = await getConnection();
      try {
        await conn.beginTransaction();
        const result = await work(conn);
        await conn.commit();
        return result;
      } catch (error) {
        try { await conn.rollback(); } catch { /* Connection discarded by release. */ }
        throw error;
      } finally { conn.release(); }
    },
    end: () => pool.end(),
    async assertApplicationReady() {
      try { await verifySchema(pool); } catch (error) { throw sanitize(error); }
    },
    async verifyMigrationState() {
      try { await verifySchema(pool); } catch (error) { throw sanitize(error); }
    },
    createAuthenticationLimiter({ keyPrefix, points }) {
      const { RateLimiterPostgres, RateLimiterRes } = require('rate-limiter-flexible');
      const limiter = new RateLimiterPostgres({ storeClient: pool, storeType: 'pool',
        schemaName: 'public', tableName: 'seguridad_intentos', tableCreated: true,
        clearExpiredByTimeout: false, keyPrefix, points, duration: 900, blockDuration: 900 });
      return { async consume(key) {
        try { return await limiter.consume(key); }
        catch (error) { throw error instanceof RateLimiterRes ? error : sanitize(error); }
      } };
    },
  };
  adapter.execute = adapter.query;
  return adapter;
}
module.exports = { createPostgres };
