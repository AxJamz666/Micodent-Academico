const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { resolveQuery } = require('../../src/db/sqlCatalog');
const { statements } = require('../../src/db/postgresPending');
const { verifySchema, TABLES, CHECKSUM } = require('../../src/db/postgresSchema');
test('U3B2 all 38 formerly pending caller IDs are explicitly represented, without arbitrary SQL rewriting', () => {
  assert.equal(new Set(statements.map(s=>s.id)).size,38);
  assert.throws(()=>resolveQuery('SELECT * FROM usuarios WHERE activo=1 OR 1=1'),/SQL_COMPATIBILITY_PENDING/);
});
test('U3B2 readiness checks exact tables and marker rather than returning a fabricated success', async () => {
  for (const fault of ['tables','marker',null]) {
    const calls=[];
    const pool={async query(sql) {
      calls.push(sql);
      if(sql.includes('information_schema.tables')) return {rows: (fault==='tables'?TABLES.slice(1):TABLES).map(table_name=>({table_name}))};
      if(sql.startsWith('SELECT checksum')) return {rows:[{checksum:fault==='marker'?'mismatch':CHECKSUM}]};
      return {rows:[]};
    }};
    if(fault) await assert.rejects(verifySchema(pool),/SCHEMA_PENDING/);
    else { await verifySchema(pool); assert.equal(calls.length,7); }
  }
});
function controller(file, db) {
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../../src/controllers',file),'utf8'),{
    module, console:{error(){}}, process:{env:{}}, Buffer,
    require(id) {
      if(id==='../config/db') return db;
      if(id==='../utils/fecha') return {fechaLima:()=> '2026-10-04'};
      if(id==='../services/accessPolicy') return {CAPABILITY:{},hasCapability:()=>true};
      if(id==='../services/operacionFinanciera') return ()=>()=>{};
      return {};
    },
  });
  return module.exports;
}
function response() { return {code:200,status(code){this.code=code;return this;},json(value){this.body=value;return this;}}; }
test('U3B2 actual history/patient controller builders match every allowed archived/search/limit variant', async () => {
  const db={async query(sql,params=[]) { resolveQuery(sql,Array.from(params)); return [[]]; }};
  for(const [file,fn,key] of [['historias.controller.js','getHistorias','incluirArchivadas'],
    ['pacientes.controller.js','getPacientes','incluirArchivados']]) {
    const handlers=controller(file,db);
    for(const search of [undefined,'FICTICIO']) for(const archive of [undefined,'true','false'])
      for(const limit of (key==='incluirArchivados'?[undefined,'5']:[undefined])) {
        const res=response();
        await handlers[fn]({query:{search,[key]:archive,limit}},res);
        assert.equal(res.code,200,[file,search,archive,limit].join('/'));
        assert.equal(res.body.ok,true);
      }
  }
});
test('U3B2 actual agenda/penalty/laboratory/production builders preserve both optional filter branches', async () => {
  const db={async query(sql,params=[]) {
    if(sql==='SET TRANSACTION READ ONLY') return [{affectedRows:0}];
    resolveQuery(sql,Array.from(params));
    return sql.startsWith('SELECT COUNT(*) AS filas') || sql.startsWith('SELECT COALESCE(SUM(costo_total)')
      ? [[{filas:0,pendientes:0,facturado:'0'}]] : [[]];
  },async getConnection(){return {...this,beginTransaction:async()=>{},commit:async()=>{},rollback:async()=>{},release(){}};}};
  for(const [file,fn,variants] of [
    ['citas.controller.js','getCitas',[{}, {doctorId:'synthu3b_doctor'}]],
    ['gastos.controller.js','getPenalidades',[{}, {doctorId:'synthu3b_doctor'}]],
    ['laboratorio.controller.js','getTrabajos',[{estado:'pagado'},{estado:'pendiente'}]],
    ['produccion.controller.js','getProduccion',[{}, {doctor:'synthu3b_doctor'}]],
  ]) {
    const handlers=controller(file,db);
    for(const variant of variants) {
      const res=response();
      await handlers[fn]({query:{desde:'2026-10-04',hasta:'2026-10-04',...variant},usuario:{id:'synthu3b_admin'}},res);
      assert.equal(res.code,200,file); assert.equal(res.body.ok,true,file);
    }
  }
});
