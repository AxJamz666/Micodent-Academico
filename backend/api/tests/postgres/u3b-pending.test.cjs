const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Pool } = require('pg');
const { settings, verifyIdentity } = require('../../scripts/postgres-u3b-safety.cjs');
const { createDatabase } = require('../../src/db/factory');
const { statements } = require('../../src/db/postgresPending');
const config = settings(process.env);
const doctor = 'synthu3b_doctor', admin = 'synthu3b_admin', date = '2026-10-04';
let pool, db;
test.before(async () => {
  pool = new Pool(config); await verifyIdentity(pool, config);
  db = createDatabase('postgres', config);
});
test.after(async () => { await db?.end(); await pool?.end(); });

test('U3B server schema retains PK/FK/UNIQUE/CHECK, identity, indexes, defaults and local types', async () => {
  const counts = await pool.query(`SELECT contype,count(*)::int AS n FROM pg_constraint
    WHERE connamespace='public'::regnamespace GROUP BY contype`);
  const byType = Object.fromEntries(counts.rows.map(row => [row.contype,row.n]));
  assert.deepEqual(byType,{p:35,f:57,c:24,u:7});
  const columns = await pool.query(`SELECT table_name,column_name,data_type,is_identity,is_generated,
    column_default,is_nullable FROM information_schema.columns WHERE table_schema='public'`);
  const get = (table,column) => columns.rows.find(row=>row.table_name===table && row.column_name===column);
  for(const table of ['pacientes','citas','consultas','pagos','radiografias','seguridad_eventos']) {
    assert.equal(get(table,'id').is_identity,'YES');
    assert.equal(get(table,'id').is_nullable,'NO');
  }
  assert.equal(get('usuarios','activo').data_type,'boolean');
  assert.equal(get('ordenes_radiografia','periapicales_piezas').data_type,'jsonb');
  assert.equal(get('consultas','costo_total').data_type,'numeric');
  assert.equal(get('consultas','ganancia_neta_clinica').is_generated,'ALWAYS');
  assert.equal(get('citas','fecha').data_type,'date');
  assert.equal(get('citas','hora_inicio').data_type,'time without time zone');
  assert.equal(get('usuarios','creado_en').data_type,'timestamp without time zone');
  assert.match(get('usuarios','creado_en').column_default,/America\/Lima/);
  const index = await pool.query("SELECT count(*)::int AS n FROM pg_indexes WHERE schemaname='public'");
  assert.ok(index.rows[0].n>=54);
  assert.equal((await pool.query("SELECT count(*)::int AS n FROM information_schema.views WHERE table_schema='public' AND table_name='pagos_vigentes'")).rows[0].n,1);
  const {rows:[privileges]} = await pool.query(`SELECT r.rolsuper,r.rolcreatedb,r.rolcreaterole,r.rolreplication,r.rolbypassrls,
    has_database_privilege(current_user,current_database(),'CREATE') AS db_create,
    has_database_privilege(current_user,current_database(),'TEMP') AS db_temp,
    has_schema_privilege(current_user,'public','CREATE') AS schema_create,
    has_table_privilege(current_user,'micodent_migrations','INSERT') AS marker_insert
    FROM pg_roles r WHERE rolname=current_user`);
  for(const value of Object.values(privileges)) assert.equal(value,false);
  const constraints = await pool.query(`SELECT c.relname AS table_name,con.conname,con.contype,
    pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con
    JOIN pg_class c ON c.oid=con.conrelid WHERE con.connamespace='public'::regnamespace
    ORDER BY c.relname,con.conname`);
  const root=path.resolve(__dirname,'../../../..');
  const output=path.join(root,'.runtime/qa'); fs.mkdirSync(output,{recursive:true});
  const hashes=Object.fromEntries(['database/init.sql','database/seeds.sql'].map(file=>
    [file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
  fs.writeFileSync(path.join(output,'U3C_SCHEMA_METADATA.json'),JSON.stringify({
    database:config.database,user:config.user,version:'17.11',constraints:byType,
    indexes:index.rows[0].n,identityColumns:columns.rows.filter(row=>row.is_identity==='YES').length,
    columns:columns.rows,constraintDefinitions:constraints.rows,privileges,hashes,
  },null,2));
});

test('U3B each of the 38 pending queries executes with real binds and rollback-preserved synthetic data', async () => {
  const fixture = {};
  const insert = async (sql,params=[]) => Number((await pool.query(sql,params)).rows[0].id);
  try {
    // Metadata only: no image, signature or external file is created or accessed.
    fixture.rx = await insert("INSERT INTO radiografias(historia_id,url_archivo,subido_por) VALUES(1,'synthetic://metadata-only-u3b2',$1) RETURNING id",[doctor]);
    fixture.archivedRx = await insert("INSERT INTO radiografias(historia_id,url_archivo,subido_por) VALUES(1,'synthetic://archived-metadata-only-u3b2',$1) RETURNING id",[doctor]);
    await pool.query('INSERT INTO radiografias_anulaciones(radiografia_id,anulada_por,anulada_en) VALUES($1,$2,LOCALTIMESTAMP)',[fixture.archivedRx,admin]);
    fixture.order = await insert('INSERT INTO ordenes_radiografia(historia_id,doctor_id,fecha) VALUES(1,$1,$2) RETURNING id',[doctor,date]);
    fixture.recipe = await insert("INSERT INTO recetas(historia_id,doctor_id,fecha,rp) VALUES(1,$1,$2,'SOLO PRUEBA U3B2') RETURNING id",[doctor,date]);
    fixture.center = await insert("INSERT INTO centros_referencia(nombre,direccion) VALUES('FICTICIO U3B2','SOLO PRUEBA') RETURNING id");
    fixture.penalty = await insert("INSERT INTO penalidades_doctor(doctor_id,monto,motivo,fecha,registrado_por) VALUES($1,1,'FICTICIO U3B2',$2,$3) RETURNING id",[doctor,date,admin]);
    fixture.lab = await insert("INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,registrado_por) VALUES(1,'FICTICIO PENDIENTE U3B2',5,$1) RETURNING id",[admin]);
    fixture.paidLab = await insert("INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,registrado_por) VALUES(1,'FICTICIO PAGADO U3B2',5,$1) RETURNING id",[admin]);
    fixture.labPayment = await insert('INSERT INTO pagos_laboratorio(trabajo_laboratorio_id,monto,fecha_pago,registrado_por) VALUES($1,5,$2,$3) RETURNING id',[fixture.paidLab,date,admin]);
    const rx = [1,doctor,date,'todo_virtual','FICTICIO U3B2','correo','[]','[]','[11]','[]','[]','[11,12]','[]'];
    const params = {
      'U3A-003':['_u3b2_query_test'], 'U3A-004':['_u3b2_query_test'],
      'U3A-005':[doctor], 'U3A-006':[1], 'U3A-015':[1],
      'U3A-017':[1,'FICTICIO U3B2',100,0,date,doctor,'FICTICIO','estandar',0,25,doctor],
      'U3A-026':[admin,'SOLO PRUEBA',1], 'U3A-035':[],
      'U3A-075':[1,'11','vestibular','SANO','SOLO PRUEBA','#000000','FICTICIO',doctor],
      'U3A-084':[1], 'U3A-087':[1], 'U3A-092':[1], 'U3A-095':[fixture.rx,admin],
      'U3A-111':[], 'U3A-112':rx, 'U3A-115':['SOLO PRUEBA',admin,fixture.order],
      'U3A-116':[...rx,fixture.order], 'U3A-118':[1,doctor,date,'SOLO PRUEBA','FICTICIO'],
      'U3A-121':['SOLO PRUEBA',admin,fixture.recipe],
      'U3A-122':[1,doctor,date,'SOLO PRUEBA','FICTICIO',fixture.recipe],
      'U3A-130':[], 'U3A-153':[1], 'U3A-154':[1], 'U3A-157':[1], 'U3A-158':[1],
      'U3A-166':[date,date,null,null,date,date,10,0],
      'U3A-167':[date,date,null,null,date,date], 'U3A-168':[date,date,null,null],
      'U3A-170':['synthu3b_query','SYNTHETIC_NOT_LOGIN','FICTICIO','FICTICIO U3B2','Dr.','o',
        'Doctor',1,3,'00000009','000000000','synthetic@example.invalid','FICTICIO',null,'SOLO PRUEBA',25],
      'U3A-171':['FICTICIO','FICTICIO U3B2','Dr.','o','Doctor','00000009','000000000',
        'synthetic@example.invalid','FICTICIO',null,'SOLO PRUEBA',25,1,0,doctor],
      'U3A-172':[doctor], 'U3A-175':[],
      'U3A-185':[admin,'synthetic_u3b2_catalog_key','a'.repeat(64)],
      'U3A-208':['SYNTHETIC_NOT_LOGIN',doctor],
    };
    const reviewed = new Set();
    for(const statement of statements) {
      let values = params[statement.id];
      if(['U3A-008','U3A-054'].includes(statement.id)) values = [date,date,...(statement.parameters===3?[doctor]:[])];
      if(statement.id==='U3A-056') values = statement.parameters?Array(4).fill('%ficticio%'):[];
      if(statement.id==='U3A-136') {
        const search = statement.parameters>=5, limit = statement.parameters===1 || statement.parameters===6;
        values = [...(search?Array(5).fill('%ficticio%'):[]),...(limit?[5]:[])];
      }
      assert.ok(values,statement.id+' has explicit synthetic parameters');
      assert.equal(values.length,statement.parameters,statement.id);
      const conn = await db.getConnection();
      let locked = false;
      try {
        if(statement.sessionLock) {
          const acquire=statements.find(s=>s.id==='U3A-003');
          const [[lock]]=await conn.query(acquire.mysql,['_u3b2_query_test']);
          assert.equal(lock.acquired,1); locked=true;
          const [[result]]=await conn.query(statements.find(s=>s.id==='U3A-004').mysql,['_u3b2_query_test']);
          assert.equal(result.released,1); locked=false;
        } else {
          await conn.beginTransaction();
          const [result]=await conn.query(statement.mysql,values);
          if(Array.isArray(result)) assert.ok(result.length>0,statement.id+' returns synthetic data');
          else {
            assert.equal(result.affectedRows,1,statement.id);
            if(statement.postgres.includes('RETURNING id')) assert.equal(typeof result.insertId,'number',statement.id);
            if(statement.id==='U3A-095') {
              const [second]=await conn.query(statement.mysql,values);
              assert.equal(second.affectedRows,1,'RX ON CONFLICT existing metadata');
            }
            if(statement.id==='U3A-185') {
              const [duplicate]=await conn.query(statement.mysql,values);
              assert.equal(duplicate.affectedRows,0,'idempotency duplicate is not inserted');
            }
          }
          await conn.rollback();
        }
        reviewed.add(statement.id);
      } finally {
        await conn.rollback();
        if(locked) await conn.query(statements.find(s=>s.id==='U3A-004').mysql,['_u3b2_query_test']);
        conn.release();
      }
    }
    assert.equal(reviewed.size,38);
    assert.equal((await pool.query("SELECT count(*)::int AS n FROM usuarios WHERE id='synthu3b_query'")).rows[0].n,0);
    assert.equal((await pool.query("SELECT count(*)::int AS n FROM finanzas_peticiones WHERE clave='synthetic_u3b2_catalog_key'")).rows[0].n,0);
    console.log('U3B2_PENDING_QUERIES: 38/38 executed; all finite variants; mutations rolled back');
  } finally {
    if(fixture.archivedRx) await pool.query('DELETE FROM radiografias_anulaciones WHERE radiografia_id=$1',[fixture.archivedRx]);
    for(const [table,key] of [['pagos_laboratorio','labPayment'],['trabajos_laboratorio','paidLab'],
      ['trabajos_laboratorio','lab'],['penalidades_doctor','penalty'],['centros_referencia','center'],
      ['recetas','recipe'],['ordenes_radiografia','order'],['radiografias','rx'],['radiografias','archivedRx']]) {
      if(fixture[key]) await pool.query(`DELETE FROM ${table} WHERE id=$1`,[fixture[key]]);
    }
  }
});
