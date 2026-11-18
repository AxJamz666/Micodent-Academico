const crypto = require('node:crypto');
const TABLES = ['antecedentes_medicos','apoderados','auditoria_financiera','auditoria_historias',
  'auditoria_pacientes','centros_referencia','citas','consultas','consultas_adendas','firmas_consentimiento',
  'gastos_clinica','historias_clinicas','odontograma_adendas','odontograma_items','ordenes_radiografia',
  'pacientes','pagos','pagos_laboratorio','penalidades_doctor','radiografias','recetas','trabajos_laboratorio',
  'triaje','usuarios','micodent_migrations','seguridad_sesiones','seguridad_eventos','seguridad_intentos',
  'finanzas_version','finanzas_costos','finanzas_pagos','finanzas_peticiones','finanzas_configuracion',
  'finanzas_pago_pos','radiografias_anulaciones'];
const CHECKSUM = crypto.createHash('sha256').update('MICODENT_POSTGRES_U3B2_SCHEMA_V1').digest('hex');
async function verifySchema(pool) {
  const pending = () => Object.assign(new Error('SCHEMA_PENDING'), { code: 'SCHEMA_PENDING' });
  const { rows } = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
  const inventory = rows.some(row => row.table_name === 'insumos');
  const required = inventory ? [...TABLES, 'insumos', 'insumos_operaciones'] : TABLES;
  if (rows.length !== required.length || required.some(name => !rows.some(row => row.table_name === name))) throw pending();
  if (inventory) {
    await pool.query('SELECT id,nombre,unidad,stock,minimo,creado_por FROM insumos LIMIT 0');
    await pool.query('SELECT id,insumo_id,usuario_id,clave,huella,tipo,cantidad,motivo,creado_en FROM insumos_operaciones LIMIT 0');
  }
  const marker = await pool.query('SELECT checksum FROM micodent_migrations WHERE id=$1', ['postgres_u3b_001']);
  if (marker.rows.length !== 1 || marker.rows[0].checksum !== CHECKSUM) throw pending();
  const probes = [
    'SELECT auth_version,activo,is_admin FROM usuarios LIMIT 0',
    'SELECT token_hash,usuario_id,auth_version,expira_epoch,revocada_en FROM seguridad_sesiones LIMIT 0',
    'SELECT "key",points,expire FROM seguridad_intentos LIMIT 0',
    'SELECT accion,usuario_id,objetivo_id FROM seguridad_eventos LIMIT 0',
    'SELECT radiografia_id,anulada_por,restaurada_en FROM radiografias_anulaciones LIMIT 0',
  ];
  for (const sql of probes) await pool.query(sql);
}
module.exports = { verifySchema, TABLES, CHECKSUM };
