function applicationProfile(env = process.env) {
  const profile = env.APP_ENV || 'development';
  if (!['development', 'university'].includes(profile)) throw new Error('APP_ENV_INVALID');
  return profile;
}

function portNumber(value, code) {
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error(code);
  }
  return Number(value);
}

function runtimeOptions(env = process.env) {
  const profile = applicationProfile(env);
  const host = profile === 'university' ? '0.0.0.0' : '127.0.0.1';
  if (env.HOST && env.HOST !== host) throw new Error('APP_HOST_INVALID');
  return {
    profile, host,
    port: portNumber(env.PORT || (profile === 'university' ? '3000' : '4000'), 'APP_PORT_INVALID'),
  };
}

function databaseSettings(env = process.env) {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = env;
  if (![DB_HOST, DB_NAME, DB_USER, DB_PASSWORD].every(value => typeof value === 'string' && value.length > 0)
      || [DB_HOST, DB_NAME, DB_USER].some(value => /[\s\0]/.test(value))) {
    throw new Error('DB_ENV_INCOMPLETE');
  }
  return { host: DB_HOST, port: portNumber(DB_PORT, 'DB_PORT_INVALID'),
    database: DB_NAME, user: DB_USER, password: DB_PASSWORD };
}

function databaseEngine(env = process.env) {
  const profile = applicationProfile(env);
  const engine = env.DB_ENGINE || (profile === 'university' ? 'postgres' : 'mysql');
  if (!['mysql', 'postgres'].includes(engine)) throw new Error('DB_ENGINE_INVALID');
  if (profile === 'university' && engine !== 'postgres') throw new Error('UNIVERSITY_DB_ENGINE_INVALID');
  return engine;
}

function postgresOptions(env = process.env) {
  if (databaseEngine(env) !== 'postgres') throw new Error('POSTGRES_ENGINE_REQUIRED');
  const mode = env.DB_SSL_MODE || 'disable';
  if (!['disable', 'require'].includes(mode)) throw new Error('DB_SSL_MODE_INVALID');
  if (mode === 'disable' && env.DB_SSL_CA) throw new Error('DB_SSL_CA_WITHOUT_TLS');
  return { ...databaseSettings(env), max: 10, connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    ssl: mode === 'require' ? { rejectUnauthorized: true, ...(env.DB_SSL_CA ? { ca: env.DB_SSL_CA } : {}) } : false };
}

module.exports = { applicationProfile, runtimeOptions, databaseSettings, databaseEngine, postgresOptions };
