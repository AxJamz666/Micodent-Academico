const { databaseOptions } = require('./environment');
const { databaseEngine } = require('./runtime');
const { createDatabase } = require('../db/factory');

module.exports = createDatabase(databaseEngine(), databaseOptions());
