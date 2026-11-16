const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');

const DATABASE = 'micodent_university_u3b_test';
const OWNER = 'micodent_university_u3b_owner';
const APP = 'micodent_u3b';
const HOSTS = ['127.0.0.1', '::1'];

function settings(env, purpose = 'app') {
  const user = purpose === 'owner' ? OWNER : APP;
  if (!['app', 'owner'].includes(purpose) || env.APP_ENV !== 'university'
      || env.U3B_SYNTHETIC !== '1' || env.DB_ENGINE !== 'postgres'
      || env.DB_NAME !== DATABASE || env.DB_USER !== user || !HOSTS.includes(env.DB_HOST)
      || !/^\d+$/.test(env.DB_PORT || '') || Number(env.DB_PORT) < 1 || Number(env.DB_PORT) > 65535
      || typeof env.DB_PASSWORD !== 'string' || !env.DB_PASSWORD) {
    throw new Error('U3B_SYNTHETIC_TARGET_REQUIRED');
  }
  return { host: env.DB_HOST, port: Number(env.DB_PORT), database: DATABASE,
    user, password: env.DB_PASSWORD, max: 4, connectionTimeoutMillis: 5000,
    options: '-c timezone=America/Lima -c search_path=public' };
}

async function verifyIdentity(pool, config) {
  const result = await pool.query(`SELECT current_database() AS db, current_user AS account,
    host(inet_server_addr()) AS host, current_setting('server_version') AS version,
    r.rolsuper, r.rolcreatedb, r.rolcreaterole, r.rolreplication,
    pg_get_userbyid(d.datdba) AS owner
    FROM pg_roles r JOIN pg_database d ON d.datname=current_database()
    WHERE r.rolname=current_user`);
  const row = result.rows[0];
  if (result.rows.length !== 1 || row.db !== DATABASE || row.account !== config.user
      || !HOSTS.includes(row.host) || row.owner !== OWNER
      || row.rolsuper || row.rolcreatedb || row.rolcreaterole || row.rolreplication) {
    throw new Error('U3B_SERVER_IDENTITY_MISMATCH');
  }
  return { database: row.db, user: row.account, host: row.host, version: row.version };
}

function sqlFiles() {
  const dir = path.resolve(__dirname, '../../../database');
  return ['init.sql', 'seeds.sql'].map(name => ({
    name, sql: fs.readFileSync(path.join(dir, name), 'utf8'),
  }));
}

function labSeedPasswords(env) {
  const admin = env.U3B_SEED_ADMIN_PASSWORD;
  const doctor = env.U3B_SEED_DOCTOR_PASSWORD;
  const valid = value => typeof value === 'string' && value.length >= 16 &&
    value.trim() === value && Buffer.byteLength(value) <= 72;
  if (!valid(admin) || !valid(doctor) || admin === doctor) {
    throw new Error('U3B_UNIQUE_SEED_PASSWORDS_REQUIRED');
  }
  return { admin, doctor };
}

async function prepare(env, Pool) {
  const config = settings(env, 'owner');
  const passwords = labSeedPasswords(env);
  const [adminHash, doctorHash] = await Promise.all([
    bcrypt.hash(passwords.admin, 12), bcrypt.hash(passwords.doctor, 12),
  ]);
  const files = sqlFiles();
  const pool = new Pool(config);
  let client;
  let preparationStarted = false;
  try {
    const identity = await verifyIdentity(pool, config);
    client = await pool.connect();
    await client.query(
      "SELECT set_config('micodent.seed_admin_hash', $1, false), set_config('micodent.seed_doctor_hash', $2, false)",
      [adminHash, doctorHash],
    );
    preparationStarted = true;
    for (const file of files) await client.query(file.sql);
    return identity;
  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch { /* Pool closes below. */ }
    }
    throw new Error(preparationStarted ? 'U3B_PREPARATION_INCOMPLETE' : 'U3B_PREPARATION_FAILED');
  } finally {
    client?.release();
    await pool.end();
  }
}

module.exports = { DATABASE, OWNER, APP, HOSTS, settings, verifyIdentity, sqlFiles, labSeedPasswords, prepare };
