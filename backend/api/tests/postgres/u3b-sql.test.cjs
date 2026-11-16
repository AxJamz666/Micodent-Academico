const test = require('node:test');
const assert = require('node:assert/strict');
const { Pool } = require('pg');
const { settings, verifyIdentity } = require('../../scripts/postgres-u3b-safety.cjs');
const { statements } = require('../../src/db/sqlCatalog');
const config = settings(process.env);
let pool;
test.before(async () => { pool = new Pool(config); await verifyIdentity(pool,config); });
test.after(async () => { await pool?.end(); });
test('U3B every reviewed static and dynamic PostgreSQL statement parses and binds on the real schema', async () => {
  const client = await pool.connect();
  const errors = [];
  try {
    for (let i=0; i<statements.length; i++) {
      const query=statements[i];
      try {
        // PREPARE validates types/columns/placeholders without changing rows or acquiring locks.
        await client.query(`PREPARE u3b_query_${i} AS ${query.postgres}`);
        await client.query(`DEALLOCATE u3b_query_${i}`);
      } catch (error) { errors.push({ id:query.id, code:error.code }); }
    }
  } finally { client.release(); }
  assert.deepEqual(errors,[]);
});

require('./u3b-pending.test.cjs');
