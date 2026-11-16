function createDatabase(engine, options, drivers = {}) {
  if (engine === 'mysql') return require('./mysql').createMysql(drivers.mysql || require('mysql2/promise'), options);
  if (engine === 'postgres') return require('./postgres').createPostgres(drivers.pg || require('pg'), options);
  throw new Error('DB_ENGINE_INVALID');
}
module.exports = { createDatabase };
