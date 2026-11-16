// U3-B: finite, individually reviewed variants; never translate arbitrary SQL.
const statements = [];
function add(id, mysql, postgres, parameters, extra = {}) {
  statements.push({ id, mysql, postgres, parameters, lock: false, ...extra });
}
add('U3A-003', 'SELECT GET_LOCK(CONCAT(DATABASE(), ?), 10) AS acquired',
  'SELECT pg_try_advisory_lock(hashtextextended(current_database() || $1,0)) AS acquired', 1, { sessionLock: 'acquire' });
add('U3A-004', 'SELECT RELEASE_LOCK(CONCAT(DATABASE(), ?)) AS released',
  'SELECT pg_advisory_unlock(hashtextextended(current_database() || $1,0)) AS released', 1, { sessionLock: 'release' });
add('U3A-005', "SELECT id FROM usuarios WHERE id=? AND rol='Doctor' AND activo=1",
  "SELECT id FROM usuarios WHERE id=$1 AND rol='Doctor' AND activo=TRUE", 1);
add('U3A-006', 'SELECT id FROM pacientes WHERE id=? AND activo=1',
  'SELECT id FROM pacientes WHERE id=$1 AND activo=TRUE', 1);
add('U3A-015', 'SELECT id FROM historias_clinicas WHERE id=? AND activa=1 FOR UPDATE',
  'SELECT id FROM historias_clinicas WHERE id=$1 AND activa=TRUE FOR UPDATE', 1, { lock: true });
add('U3A-017', `INSERT INTO consultas(historia_id,descripcion,costo_total,abono_inicial,fecha_consulta,doctor_id,
    estado_clinico,tipo_comision,cantidad_radiografias,comision_porcentaje_aplicado,firmado_por,firmado_en,bloqueada)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,NOW(),1)`,
  `INSERT INTO consultas(historia_id,descripcion,costo_total,abono_inicial,fecha_consulta,doctor_id,
    estado_clinico,tipo_comision,cantidad_radiografias,comision_porcentaje_aplicado,firmado_por,firmado_en,bloqueada)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE) RETURNING id`, 11);
add('U3A-026', 'UPDATE finanzas_pagos SET anulado=1,anulado_por=?,anulado_en=NOW(),motivo_anulacion=? WHERE pago_id=?',
  "UPDATE finanzas_pagos SET anulado=TRUE,anulado_por=$1,anulado_en=statement_timestamp() AT TIME ZONE 'America/Lima',motivo_anulacion=$2 WHERE pago_id=$3", 3);
add('U3A-035', 'SELECT COUNT(*) AS totalHistorias FROM historias_clinicas WHERE activa = 1',
  'SELECT COUNT(*) AS "totalHistorias" FROM historias_clinicas WHERE activa=TRUE', 0);
add('U3A-075', `INSERT INTO odontograma_items
       (historia_id, pieza, cara, estado_codigo, estado_nombre, color, notas, registrado_por, firmado_en, bloqueada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)`,
  `INSERT INTO odontograma_items
       (historia_id,pieza,cara,estado_codigo,estado_nombre,color,notas,registrado_por,firmado_en,bloqueada)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE) RETURNING id`, 8);
for (const [id, flag] of [['U3A-084',false],['U3A-087',true],['U3A-154',false],['U3A-158',true]]) {
  add(id, `UPDATE historias_clinicas SET activa = ${flag ? 1 : 0} WHERE paciente_id = ?`,
    `UPDATE historias_clinicas SET activa=${flag ? 'TRUE' : 'FALSE'} WHERE paciente_id=$1`, 1);
}
add('U3A-095', `INSERT INTO radiografias_anulaciones(radiografia_id,anulada_por,anulada_en)
      VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE anulada_por=VALUES(anulada_por),anulada_en=VALUES(anulada_en),restaurada_por=NULL,restaurada_en=NULL`,
  `INSERT INTO radiografias_anulaciones(radiografia_id,anulada_por,anulada_en)
      VALUES($1,$2,statement_timestamp() AT TIME ZONE 'America/Lima')
      ON CONFLICT(radiografia_id) DO UPDATE SET anulada_por=EXCLUDED.anulada_por,
      anulada_en=EXCLUDED.anulada_en,restaurada_por=NULL,restaurada_en=NULL`, 2);
add('U3A-111', 'SELECT * FROM centros_referencia WHERE activo = 1 ORDER BY nombre ASC',
  'SELECT * FROM centros_referencia WHERE activo=TRUE ORDER BY nombre ASC', 0);
const rxColumns = 'historia_id,doctor_id,fecha,tipo_solicitud,motivo,envio_virtual,extraorales,tomografias,piezas_tomografia,fotografias,intraorales,periapicales_piezas,modelos_estudio,firmado_en,bloqueada';
add('U3A-112', `INSERT INTO ordenes_radiografia
       (historia_id, doctor_id, fecha, tipo_solicitud, motivo, envio_virtual,
        extraorales, tomografias, piezas_tomografia, fotografias, intraorales, periapicales_piezas, modelos_estudio,
        firmado_en, bloqueada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)`,
  `INSERT INTO ordenes_radiografia(${rxColumns}) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE) RETURNING id`, 13);
add('U3A-116', `INSERT INTO ordenes_radiografia
       (historia_id, doctor_id, fecha, tipo_solicitud, motivo, envio_virtual,
        extraorales, tomografias, piezas_tomografia, fotografias, intraorales, periapicales_piezas, modelos_estudio,
        firmado_en, bloqueada, reemplaza_a)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1, ?)`,
  `INSERT INTO ordenes_radiografia(${rxColumns},reemplaza_a) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE,$14) RETURNING id`, 14);
for (const [id, table] of [['U3A-115','ordenes_radiografia'],['U3A-121','recetas']]) {
  add(id, `UPDATE ${table} SET anulada = 1, motivo_anulacion = ?, anulada_por = ?, anulada_en = NOW() WHERE id = ?`,
    `UPDATE ${table} SET anulada=TRUE,motivo_anulacion=$1,anulada_por=$2,anulada_en=statement_timestamp() AT TIME ZONE 'America/Lima' WHERE id=$3`, 3);
}
add('U3A-118', `INSERT INTO recetas (historia_id, doctor_id, fecha, rp, indicaciones, firmado_en, bloqueada)
       VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
  `INSERT INTO recetas(historia_id,doctor_id,fecha,rp,indicaciones,firmado_en,bloqueada)
    VALUES($1,$2,$3,$4,$5,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE) RETURNING id`, 5);
add('U3A-122', `INSERT INTO recetas (historia_id, doctor_id, fecha, rp, indicaciones, firmado_en, bloqueada, reemplaza_a)
       VALUES (?, ?, ?, ?, ?, NOW(), 1, ?)`,
  `INSERT INTO recetas(historia_id,doctor_id,fecha,rp,indicaciones,firmado_en,bloqueada,reemplaza_a)
    VALUES($1,$2,$3,$4,$5,statement_timestamp() AT TIME ZONE 'America/Lima',TRUE,$6) RETURNING id`, 6);
for (const [id, flag] of [['U3A-153',false],['U3A-157',true]]) {
  add(id, `UPDATE pacientes SET activo = ${flag ? 1 : 0} WHERE id = ?`,
    `UPDATE pacientes SET activo=${flag ? 'TRUE' : 'FALSE'} WHERE id=$1`, 1);
}
add('U3A-168', `SELECT COALESCE(SUM(costo_total),0) AS facturado FROM consultas
      WHERE fecha_consulta BETWEEN ? AND ? AND (? IS NULL OR doctor_id=?)`,
  'SELECT COALESCE(SUM(costo_total),0) AS facturado FROM consultas WHERE fecha_consulta BETWEEN $1 AND $2 AND ($3::varchar IS NULL OR doctor_id=$4)', 4);
add('U3A-170', `INSERT INTO usuarios (id, password_hash, nombre, nombre_completo, prefix, gender,
          rol, is_admin, nivel, dni, telefono, email, especialidad, cop, direccion, comision_porcentaje)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  `INSERT INTO usuarios(id,password_hash,nombre,nombre_completo,prefix,gender,rol,is_admin,nivel,dni,telefono,email,especialidad,cop,direccion,comision_porcentaje)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`, 16);
add('U3A-171', `UPDATE usuarios SET nombre = ?, nombre_completo = ?, prefix = ?, gender = ?, rol = ?,
          dni = ?, telefono = ?, email = ?, especialidad = ?, cop = ?,
          direccion = ?, comision_porcentaje = ?, nivel = ?, is_admin = ? WHERE id = ?`,
  `UPDATE usuarios SET nombre=$1,nombre_completo=$2,prefix=$3,gender=$4,rol=$5,dni=$6,telefono=$7,email=$8,especialidad=$9,cop=$10,
    direccion=$11,comision_porcentaje=$12,nivel=$13,is_admin=$14 WHERE id=$15`, 15);
add('U3A-172', 'UPDATE usuarios SET activo = 0 WHERE id = ?', 'UPDATE usuarios SET activo=FALSE WHERE id=$1', 1);
add('U3A-175', `SELECT id, nombre_completo, prefix, especialidad FROM usuarios WHERE rol = 'Doctor' AND activo = 1 ORDER BY nombre_completo ASC`,
  "SELECT id,nombre_completo,prefix,especialidad FROM usuarios WHERE rol='Doctor' AND activo=TRUE ORDER BY nombre_completo ASC", 0);
add('U3A-185', 'INSERT IGNORE INTO finanzas_peticiones(usuario_id, clave, huella) VALUES (?, ?, ?)',
  'INSERT INTO finanzas_peticiones(usuario_id,clave,huella) VALUES($1,$2,$3) ON CONFLICT(usuario_id,clave) DO NOTHING', 3);
add('U3A-208', 'UPDATE usuarios SET password_hash = ?, activo = 1 WHERE id = ?',
  'UPDATE usuarios SET password_hash=$1,activo=TRUE WHERE id=$2', 2);

const agenda = `SELECT c.*,u.nombre_completo AS doctor_nombre,u.prefix AS doctor_prefix,
      p.nombres AS paciente_nombres,p.apellidos AS paciente_apellidos
      FROM citas c LEFT JOIN usuarios u ON c.doctor_id=u.id
      LEFT JOIN pacientes p ON c.paciente_id=p.id WHERE c.fecha BETWEEN ? AND ?`;
for (const doctor of [false, true]) {
  add('U3A-008', agenda + (doctor ? ' AND c.doctor_id=?' : '') + ' ORDER BY c.fecha ASC,c.hora_inicio ASC,c.id ASC',
    `SELECT c.*,u.nombre_completo AS doctor_nombre,u.prefix AS doctor_prefix,
      p.nombres AS paciente_nombres,p.apellidos AS paciente_apellidos FROM citas c
      LEFT JOIN usuarios u ON c.doctor_id=u.id LEFT JOIN pacientes p ON c.paciente_id=p.id
      WHERE c.fecha BETWEEN $1 AND $2${doctor ? ' AND c.doctor_id=$3' : ''} ORDER BY c.fecha ASC,c.hora_inicio ASC,c.id ASC`, doctor ? 3 : 2);
  add('U3A-054', `
      SELECT pd.*, d.nombre_completo AS doctor_nombre, u.nombre_completo AS registrado_por_nombre
      FROM penalidades_doctor pd
      LEFT JOIN usuarios d ON pd.doctor_id = d.id
      LEFT JOIN usuarios u ON pd.registrado_por = u.id
      WHERE pd.fecha BETWEEN ? AND ?` + (doctor ? ' AND pd.doctor_id = ?' : '') + ' ORDER BY pd.fecha DESC',
    `SELECT pd.*,d.nombre_completo AS doctor_nombre,u.nombre_completo AS registrado_por_nombre
      FROM penalidades_doctor pd LEFT JOIN usuarios d ON pd.doctor_id=d.id
      LEFT JOIN usuarios u ON pd.registrado_por=u.id WHERE pd.fecha BETWEEN $1 AND $2
      ${doctor ? 'AND pd.doctor_id=$3' : ''} ORDER BY pd.fecha DESC`, doctor ? 3 : 2);
}
for (const archived of [false,true]) {
  const condition = archived ? 'a.radiografia_id IS NOT NULL' : 'a.radiografia_id IS NULL';
  add('U3A-092', `SELECT r.*, u.nombre_completo AS subido_por_nombre, a.anulada_en, a.anulada_por
       FROM radiografias r
       LEFT JOIN usuarios u ON r.subido_por = u.id
       LEFT JOIN radiografias_anulaciones a ON a.radiografia_id=r.id AND a.restaurada_en IS NULL
       WHERE r.historia_id = ? AND ${condition}
       ORDER BY r.creado_en DESC`,
    `SELECT r.*,u.nombre_completo AS subido_por_nombre,a.anulada_en,a.anulada_por FROM radiografias r
      LEFT JOIN usuarios u ON r.subido_por=u.id LEFT JOIN radiografias_anulaciones a
      ON a.radiografia_id=r.id AND a.restaurada_en IS NULL WHERE r.historia_id=$1 AND ${condition} ORDER BY r.creado_en DESC`, 1);
}
for (const paid of [false,true]) {
  const balance = paid ? '<= 0' : '> 0', order = paid ? 'ultima_fecha_pago DESC' : 't.creado_en ASC';
  add('U3A-130', `SELECT t.id, t.nombre_laboratorio, t.monto_total, t.consulta_id, t.descripcion, t.creado_en,
              h.nro_historia, p.nombres, p.apellidos,
              COALESCE((SELECT SUM(pl.monto) FROM pagos_laboratorio pl WHERE pl.trabajo_laboratorio_id = t.id), 0) AS total_pagado,
              (SELECT MAX(pl.fecha_pago) FROM pagos_laboratorio pl WHERE pl.trabajo_laboratorio_id = t.id) AS ultima_fecha_pago
       FROM trabajos_laboratorio t
       JOIN consultas c ON t.consulta_id = c.id
       JOIN historias_clinicas h ON c.historia_id = h.id
       JOIN pacientes p ON h.paciente_id = p.id
       HAVING (t.monto_total - total_pagado) ${balance}
       ORDER BY ${order}`,
    `SELECT t.* FROM (SELECT t.id,t.nombre_laboratorio,t.monto_total,t.consulta_id,t.descripcion,t.creado_en,
      h.nro_historia,p.nombres,p.apellidos,COALESCE((SELECT SUM(pl.monto) FROM pagos_laboratorio pl
      WHERE pl.trabajo_laboratorio_id=t.id),0) AS total_pagado,(SELECT MAX(pl.fecha_pago) FROM pagos_laboratorio pl
      WHERE pl.trabajo_laboratorio_id=t.id) AS ultima_fecha_pago FROM trabajos_laboratorio t
      JOIN consultas c ON t.consulta_id=c.id JOIN historias_clinicas h ON c.historia_id=h.id
      JOIN pacientes p ON h.paciente_id=p.id) t WHERE t.monto_total-t.total_pagado ${balance} ORDER BY ${order}`, 0);
}
const where = '(? IS NULL OR c.doctor_id=?) AND (p.id IS NOT NULL OR c.fecha_consulta BETWEEN ? AND ?)';
const from = `FROM consultas c JOIN historias_clinicas h ON h.id=c.historia_id JOIN pacientes pa ON pa.id=h.paciente_id
      LEFT JOIN usuarios du ON du.id=c.doctor_id
      LEFT JOIN pagos_vigentes p ON p.consulta_id=c.id AND p.fecha_pago BETWEEN ? AND ?
      LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE ${where}`;
const pgFrom = `FROM consultas c JOIN historias_clinicas h ON h.id=c.historia_id JOIN pacientes pa ON pa.id=h.paciente_id
    LEFT JOIN usuarios du ON du.id=c.doctor_id LEFT JOIN pagos_vigentes p ON p.consulta_id=c.id AND p.fecha_pago BETWEEN $1 AND $2
    LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE ($3::varchar IS NULL OR c.doctor_id=$4)
    AND (p.id IS NOT NULL OR c.fecha_consulta BETWEEN $5 AND $6)`;
add('U3A-166', `SELECT c.id AS consulta_id,c.descripcion,c.costo_total,c.doctor_id,du.nombre_completo AS doctor_nombre,
      CONCAT(pa.apellidos, ', ',pa.nombres) AS paciente, COALESCE(p.fecha_pago,c.fecha_consulta) AS fecha,
      p.id AS pago_id,COALESCE(p.monto,0) AS abonado, f.porcentaje,COALESCE(p.comision_generada,0) AS comision,
      CASE WHEN f.regla='legacy_pendiente' THEN NULL ELSE COALESCE(f.costo_aplicado,0) END AS costo_externo,
      CASE WHEN f.regla='legacy_pendiente' THEN NULL ELSE COALESCE(f.margen_clinica,0) END AS margen,
      f.regla ${from} ORDER BY fecha DESC,c.id DESC,p.id DESC LIMIT ? OFFSET ?`,
  `SELECT c.id AS consulta_id,c.descripcion,c.costo_total,c.doctor_id,du.nombre_completo AS doctor_nombre,
    CONCAT(pa.apellidos, ', ',pa.nombres) AS paciente,COALESCE(p.fecha_pago,c.fecha_consulta) AS fecha,p.id AS pago_id,
    COALESCE(p.monto,0) AS abonado,f.porcentaje,COALESCE(p.comision_generada,0) AS comision,
    CASE WHEN f.regla='legacy_pendiente' THEN NULL ELSE COALESCE(f.costo_aplicado,0) END AS costo_externo,
    CASE WHEN f.regla='legacy_pendiente' THEN NULL ELSE COALESCE(f.margen_clinica,0) END AS margen,f.regla
    ${pgFrom} ORDER BY fecha DESC,c.id DESC,p.id DESC LIMIT $7 OFFSET $8`, 8);
add('U3A-167', `SELECT COUNT(*) AS filas,COALESCE(SUM(p.monto),0) AS cobrado,
      COALESCE(SUM(p.comision_generada),0) AS comision,COALESCE(SUM(f.costo_aplicado),0) AS costo_externo,
      COALESCE(SUM(f.margen_clinica),0) AS margen,
      COALESCE(SUM(CASE WHEN f.regla='legacy_pendiente' THEN 1 ELSE 0 END),0) AS pendientes ${from}`,
  `SELECT COUNT(*) AS filas,COALESCE(SUM(p.monto),0) AS cobrado,COALESCE(SUM(p.comision_generada),0) AS comision,
    COALESCE(SUM(f.costo_aplicado),0) AS costo_externo,COALESCE(SUM(f.margen_clinica),0) AS margen,
    COALESCE(SUM(CASE WHEN f.regla='legacy_pendiente' THEN 1 ELSE 0 END),0) AS pendientes ${pgFrom}`, 6);
// Preserve Spanish name searches without adding an extension or altering data.
const fold = expression => `translate(lower(${expression}),
  '\u00e1\u00e0\u00e4\u00e2\u00e3\u00e5\u00e9\u00e8\u00eb\u00ea\u00ed\u00ec\u00ef\u00ee\u00f3\u00f2\u00f6\u00f4\u00f5\u00fa\u00f9\u00fc\u00fb\u00f1',
  'aaaaaaeeeeiiiiooooouuuun')`;
const historyBase = `
      SELECT h.id, h.paciente_id, h.nro_historia, h.fecha_creacion, h.activa,
             p.nombres, p.apellidos, p.dni,
             u.nombre_completo AS creado_por_nombre,
             u.especialidad AS doctor_especialidad, u.cop AS doctor_cop,
             u.firma_digital AS doctor_firma, u.sello_digital AS doctor_sello,
             COALESCE(SUM(c.costo_total), 0) AS total_tratamientos,
             COALESCE((
               SELECT SUM(pg.monto) FROM pagos_vigentes pg
               JOIN consultas cc ON pg.consulta_id = cc.id
               WHERE cc.historia_id = h.id
             ), 0) AS total_pagado
      FROM historias_clinicas h
      JOIN pacientes p ON h.paciente_id = p.id
      LEFT JOIN usuarios u ON h.creado_por = u.id
      LEFT JOIN consultas c ON c.historia_id = h.id`;
for (const active of [false,true]) for (const search of [false,true]) {
  const mysqlConditions = [], pgConditions = [];
  if (active) { mysqlConditions.push('h.activa = 1'); pgConditions.push('h.activa=TRUE'); }
  if (search) {
    mysqlConditions.push('(p.nombres LIKE ? OR p.apellidos LIKE ? OR p.dni LIKE ? OR h.nro_historia LIKE ?)');
    pgConditions.push('(' + ['p.nombres','p.apellidos','p.dni','h.nro_historia']
      .map((column, i) => `${fold(column)} LIKE ${fold('$' + (i+1) + '::text')}`).join(' OR ') + ')');
  }
  add('U3A-056', historyBase + (mysqlConditions.length ? ' WHERE ' + mysqlConditions.join(' AND ') : '')
      + ' GROUP BY h.id ORDER BY h.creado_en DESC',
    historyBase + (pgConditions.length ? ' WHERE ' + pgConditions.join(' AND ') : '')
      + ' GROUP BY h.id,p.id,u.id ORDER BY h.creado_en DESC', search ? 4 : 0);
}
const patientBase = `
      SELECT p.*, u.nombre_completo AS registrado_por_nombre,
             h.id AS historia_id, h.nro_historia, h.activa AS historia_activa,
             (CASE
               WHEN am.motivo_consulta IS NOT NULL AND am.motivo_consulta != '' THEN 1
               WHEN am.diagnostico IS NOT NULL AND am.diagnostico != '' THEN 1
               ELSE 0
             END) AS tiene_antecedentes,
             (SELECT COUNT(*) FROM odontograma_items WHERE historia_id = h.id) AS total_odontograma,
             (SELECT COUNT(*) FROM consultas WHERE historia_id = h.id) AS total_evoluciones,
             GREATEST(
               COALESCE(h.creado_en, p.creado_en),
               COALESCE(am.actualizado_en, h.creado_en, p.creado_en),
               COALESCE((SELECT MAX(creado_en) FROM consultas WHERE historia_id = h.id), h.creado_en, p.creado_en),
               COALESCE((SELECT MAX(fecha_registro) FROM odontograma_items WHERE historia_id = h.id), h.creado_en, p.creado_en),
               COALESCE((SELECT MAX(creado_en) FROM radiografias WHERE historia_id = h.id), h.creado_en, p.creado_en)
             ) AS ultima_actividad
      FROM pacientes p
      LEFT JOIN usuarios u ON p.registrado_por = u.id
      LEFT JOIN historias_clinicas h ON h.paciente_id = p.id
      LEFT JOIN antecedentes_medicos am ON am.historia_id = h.id`;
for (const search of [false,true]) for (const active of [false,true]) for (const limit of [false,true]) {
  const mysqlConditions = [], pgConditions = [];
  if (search) {
    mysqlConditions.push('(p.nombres LIKE ? OR p.apellidos LIKE ? OR p.dni LIKE ? OR h.nro_historia LIKE ? OR p.celular LIKE ?)');
    pgConditions.push('(' + ['p.nombres','p.apellidos','p.dni','h.nro_historia','p.celular']
      .map((column,i) => `${fold(column)} LIKE ${fold('$' + (i+1) + '::text')}`).join(' OR ') + ')');
  }
  if (active) { mysqlConditions.push('p.activo = 1'); pgConditions.push('p.activo=TRUE'); }
  const limitParameter = search ? 6 : 1;
  add('U3A-136', patientBase + (mysqlConditions.length ? ' WHERE ' + mysqlConditions.join(' AND ') : '')
      + ' ORDER BY p.creado_en DESC, p.id DESC' + (limit ? ' LIMIT ?' : ''),
    patientBase + (pgConditions.length ? ' WHERE ' + pgConditions.join(' AND ') : '')
      + ' ORDER BY p.creado_en DESC, p.id DESC' + (limit ? ` LIMIT $${limitParameter}` : ''),
    (search ? 5 : 0) + (limit ? 1 : 0));
}
module.exports = { statements };
