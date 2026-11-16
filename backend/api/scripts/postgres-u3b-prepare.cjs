const { prepare } = require('./postgres-u3b-safety.cjs');

if (require.main === module) {
  prepare(process.env, require('pg').Pool).then(identity => {
    console.log(JSON.stringify({ status: 'SYNTHETIC_SCHEMA_AND_SEEDS_PREPARED', ...identity }));
  }).catch(error => {
    const code = error.message === 'U3B_PREPARATION_INCOMPLETE' ? error.message : 'U3B_PREPARATION_FAILED';
    console.error(code + ': inspect the isolated target. Do not repeat over existing tables.');
    process.exitCode = 1;
  });
}
