// Explicit, individually reviewed statements. No runtime SQL rewriting.
const statements = [
  {
    "id": "U3A-001",
    "mysql": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_financiera a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       ORDER BY a.fecha DESC, a.hora DESC, a.id DESC\n       LIMIT 200",
    "postgres": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_financiera a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       ORDER BY a.fecha DESC, a.hora DESC, a.id DESC\n       LIMIT 200",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-002",
    "mysql": "SELECT id, nombre, nombre_completo, rol, prefix, gender,\n       is_admin, nivel, especialidad, cop, dni, telefono, email, direccion,\n       firma_digital, sello_digital, comision_porcentaje\n       FROM usuarios WHERE id = ?",
    "postgres": "SELECT id, nombre, nombre_completo, rol, prefix, gender,\n       is_admin, nivel, especialidad, cop, dni, telefono, email, direccion,\n       firma_digital, sello_digital, comision_porcentaje\n       FROM usuarios WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-007",
    "mysql": "SELECT id,hora_inicio,duracion_minutos FROM citas\n    WHERE doctor_id=? AND fecha=? AND estado!='cancelada'",
    "postgres": "SELECT id,hora_inicio,duracion_minutos FROM citas\n    WHERE doctor_id=$1 AND fecha=$2 AND estado!='cancelada'",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-009",
    "mysql": "INSERT INTO citas\n        (paciente_id,nombre_contacto,celular_contacto,motivo_consulta,doctor_id,fecha,hora_inicio,duracion_minutos,creado_por)\n        VALUES (?,?,?,?,?,?,?,?,?)",
    "postgres": "INSERT INTO citas\n        (paciente_id,nombre_contacto,celular_contacto,motivo_consulta,doctor_id,fecha,hora_inicio,duracion_minutos,creado_por)\n        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
    "parameters": 9,
    "lock": false
  },
  {
    "id": "U3A-010",
    "mysql": "SELECT * FROM citas WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM citas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-011",
    "mysql": "UPDATE citas SET paciente_id=?,nombre_contacto=?,celular_contacto=?,motivo_consulta=?,\n        doctor_id=?,fecha=?,hora_inicio=?,duracion_minutos=? WHERE id=?",
    "postgres": "UPDATE citas SET paciente_id=$1,nombre_contacto=$2,celular_contacto=$3,motivo_consulta=$4,\n        doctor_id=$5,fecha=$6,hora_inicio=$7,duracion_minutos=$8 WHERE id=$9",
    "parameters": 9,
    "lock": false
  },
  {
    "id": "U3A-012",
    "mysql": "SELECT * FROM citas WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM citas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-013",
    "mysql": "UPDATE citas SET estado=? WHERE id=?",
    "postgres": "UPDATE citas SET estado=$1 WHERE id=$2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-014",
    "mysql": "SELECT * FROM consultas WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM consultas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-016",
    "mysql": "SELECT comision_porcentaje FROM usuarios WHERE id=?",
    "postgres": "SELECT comision_porcentaje FROM usuarios WHERE id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-018",
    "mysql": "INSERT INTO finanzas_costos(consulta_id,otros_costos,origen) VALUES(?,?,?)",
    "postgres": "INSERT INTO finanzas_costos(consulta_id,otros_costos,origen) VALUES($1,$2,$3)",
    "parameters": 3,
    "lock": false
  },
  {
    "id": "U3A-019",
    "mysql": "INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,registrado_por) VALUES(?,?,?,?)",
    "postgres": "INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,registrado_por) VALUES($1,$2,$3,$4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-020",
    "mysql": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES(?,?,?,?,?)",
    "postgres": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES($1,$2,$3,$4,$5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-021",
    "mysql": "SELECT consulta_id FROM pagos WHERE id=?",
    "postgres": "SELECT consulta_id FROM pagos WHERE id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-022",
    "mysql": "SELECT * FROM consultas WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM consultas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-023",
    "mysql": "SELECT origen FROM finanzas_costos WHERE consulta_id=?",
    "postgres": "SELECT origen FROM finanzas_costos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-024",
    "mysql": "SELECT anulado FROM finanzas_pagos WHERE pago_id=?",
    "postgres": "SELECT anulado FROM finanzas_pagos WHERE pago_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-025",
    "mysql": "SELECT id FROM pagos_vigentes WHERE consulta_id=? ORDER BY id DESC LIMIT 1",
    "postgres": "SELECT id FROM pagos_vigentes WHERE consulta_id=$1 ORDER BY id DESC LIMIT 1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-027",
    "mysql": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES(?,?,?,?,?)",
    "postgres": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES($1,$2,$3,$4,$5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-028",
    "mysql": "SELECT * FROM consultas WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM consultas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-029",
    "mysql": "SELECT origen FROM finanzas_costos WHERE consulta_id=?",
    "postgres": "SELECT origen FROM finanzas_costos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-030",
    "mysql": "SELECT p.id,p.monto,p.comision_generada FROM pagos_vigentes p\n    JOIN finanzas_pagos fp ON fp.pago_id=p.id WHERE p.consulta_id=? AND fp.regla='legacy_pendiente' ORDER BY p.id",
    "postgres": "SELECT p.id,p.monto,p.comision_generada FROM pagos_vigentes p\n    JOIN finanzas_pagos fp ON fp.pago_id=p.id WHERE p.consulta_id=$1 AND fp.regla='legacy_pendiente' ORDER BY p.id",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-031",
    "mysql": "UPDATE finanzas_pagos SET costo_aplicado=?,base_comisionable=?,margen_clinica=?,regla='legacy_conciliado' WHERE pago_id=?",
    "postgres": "UPDATE finanzas_pagos SET costo_aplicado=$1,base_comisionable=$2,margen_clinica=$3,regla='legacy_conciliado' WHERE pago_id=$4",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-032",
    "mysql": "UPDATE finanzas_costos SET origen='legacy_conciliado' WHERE consulta_id=?",
    "postgres": "UPDATE finanzas_costos SET origen='legacy_conciliado' WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-033",
    "mysql": "SELECT COALESCE(SUM(monto + COALESCE(recargo_pos,0)), 0) AS ingresosHoy FROM pagos_vigentes WHERE fecha_pago = ?",
    "postgres": "SELECT COALESCE(SUM(monto + COALESCE(recargo_pos,0)), 0) AS \"ingresosHoy\" FROM pagos_vigentes WHERE fecha_pago = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-034",
    "mysql": "SELECT COUNT(*) AS sinHistoria FROM pacientes p\n       LEFT JOIN historias_clinicas h ON p.id = h.paciente_id\n       WHERE h.id IS NULL",
    "postgres": "SELECT COUNT(*) AS \"sinHistoria\" FROM pacientes p\n       LEFT JOIN historias_clinicas h ON p.id = h.paciente_id\n       WHERE h.id IS NULL",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-036",
    "mysql": "SELECT COUNT(DISTINCT c.historia_id) AS deudores\n       FROM consultas c\n       LEFT JOIN (SELECT consulta_id, SUM(monto) AS pagado FROM pagos_vigentes GROUP BY consulta_id) p \n       ON c.id = p.consulta_id\n       WHERE c.costo_total > COALESCE(p.pagado, 0)",
    "postgres": "SELECT COUNT(DISTINCT c.historia_id) AS deudores\n       FROM consultas c\n       LEFT JOIN (SELECT consulta_id, SUM(monto) AS pagado FROM pagos_vigentes GROUP BY consulta_id) p \n       ON c.id = p.consulta_id\n       WHERE c.costo_total > COALESCE(p.pagado, 0)",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-037",
    "mysql": "SELECT h.paciente_id, h.nro_historia, h.fecha_creacion, p.nombres, p.apellidos\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       ORDER BY h.creado_en DESC LIMIT 5",
    "postgres": "SELECT h.paciente_id, h.nro_historia, h.fecha_creacion, p.nombres, p.apellidos\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       ORDER BY h.creado_en DESC LIMIT 5",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-038",
    "mysql": "SELECT h.paciente_id AS id, p.nombres, p.apellidos, c.id AS consulta_id,\n              c.descripcion,c.fecha_consulta,c.costo_total,COALESCE(pg.pagado,0) AS pagado,\n              c.costo_total - COALESCE(pg.pagado,0) AS pendiente\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       JOIN consultas c ON h.id = c.historia_id\n       LEFT JOIN (SELECT consulta_id, SUM(monto) AS pagado FROM pagos_vigentes GROUP BY consulta_id) pg \n       ON c.id = pg.consulta_id\n       WHERE c.costo_total > COALESCE(pg.pagado,0)\n       ORDER BY p.apellidos,p.nombres,p.id,c.fecha_consulta,c.id",
    "postgres": "SELECT h.paciente_id AS id, p.nombres, p.apellidos, c.id AS consulta_id,\n              c.descripcion,c.fecha_consulta,c.costo_total,COALESCE(pg.pagado,0) AS pagado,\n              c.costo_total - COALESCE(pg.pagado,0) AS pendiente\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       JOIN consultas c ON h.id = c.historia_id\n       LEFT JOIN (SELECT consulta_id, SUM(monto) AS pagado FROM pagos_vigentes GROUP BY consulta_id) pg \n       ON c.id = pg.consulta_id\n       WHERE c.costo_total > COALESCE(pg.pagado,0)\n       ORDER BY p.apellidos,p.nombres,p.id,c.fecha_consulta,c.id",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-039",
    "mysql": "SELECT c.*, u.nombre_completo AS doctor_nombre, u.prefix AS doctor_prefix\n       FROM citas c\n       LEFT JOIN usuarios u ON c.doctor_id = u.id\n       WHERE c.fecha = ? AND c.estado != 'cancelada'\n       ORDER BY c.hora_inicio ASC",
    "postgres": "SELECT c.*, u.nombre_completo AS doctor_nombre, u.prefix AS doctor_prefix\n       FROM citas c\n       LEFT JOIN usuarios u ON c.doctor_id = u.id\n       WHERE c.fecha = $1 AND c.estado != 'cancelada'\n       ORDER BY c.hora_inicio ASC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-041",
    "mysql": "SELECT\n         u.id AS doctor_id,\n         u.nombre_completo AS doctor_nombre,\n         COUNT(DISTINCT p.id) AS pagos_recibidos,\n         COUNT(DISTINCT CASE WHEN p.id IS NOT NULL THEN c.historia_id END) AS pacientes_atendidos,\n         COALESCE(SUM(p.monto), 0) AS total_cobrado,\n         COALESCE(SUM(p.comision_generada), 0) AS comision_bruta,\n         COALESCE((SELECT SUM(pd.monto) FROM penalidades_doctor pd WHERE pd.doctor_id = u.id AND pd.fecha BETWEEN ? AND ?), 0) AS penalidades\n       FROM usuarios u\n       LEFT JOIN consultas c ON c.doctor_id = u.id\n       LEFT JOIN pagos_vigentes p ON p.consulta_id = c.id AND p.fecha_pago BETWEEN ? AND ?\n       WHERE u.rol = 'Doctor' OR EXISTS(SELECT 1 FROM consultas historial WHERE historial.doctor_id=u.id)\n       GROUP BY u.id, u.nombre_completo\n       ORDER BY total_cobrado DESC",
    "postgres": "SELECT\n         u.id AS doctor_id,\n         u.nombre_completo AS doctor_nombre,\n         COUNT(DISTINCT p.id) AS pagos_recibidos,\n         COUNT(DISTINCT CASE WHEN p.id IS NOT NULL THEN c.historia_id END) AS pacientes_atendidos,\n         COALESCE(SUM(p.monto), 0) AS total_cobrado,\n         COALESCE(SUM(p.comision_generada), 0) AS comision_bruta,\n         COALESCE((SELECT SUM(pd.monto) FROM penalidades_doctor pd WHERE pd.doctor_id = u.id AND pd.fecha BETWEEN $1 AND $2), 0) AS penalidades\n       FROM usuarios u\n       LEFT JOIN consultas c ON c.doctor_id = u.id\n       LEFT JOIN pagos_vigentes p ON p.consulta_id = c.id AND p.fecha_pago BETWEEN $3 AND $4\n       WHERE u.rol = 'Doctor' OR EXISTS(SELECT 1 FROM consultas historial WHERE historial.doctor_id=u.id)\n       GROUP BY u.id, u.nombre_completo\n       ORDER BY total_cobrado DESC",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-042",
    "mysql": "SELECT COALESCE(SUM(monto), 0) AS costoLaboratorioPagado\n       FROM pagos_laboratorio WHERE fecha_pago BETWEEN ? AND ?",
    "postgres": "SELECT COALESCE(SUM(monto), 0) AS \"costoLaboratorioPagado\"\n       FROM pagos_laboratorio WHERE fecha_pago BETWEEN $1 AND $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-043",
    "mysql": "SELECT categoria, COALESCE(SUM(monto), 0) AS total\n       FROM gastos_clinica WHERE fecha_pago BETWEEN ? AND ? AND estado = 'activo'\n       GROUP BY categoria",
    "postgres": "SELECT categoria, COALESCE(SUM(monto), 0) AS total\n       FROM gastos_clinica WHERE fecha_pago BETWEEN $1 AND $2 AND estado = 'activo'\n       GROUP BY categoria",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-044",
    "mysql": "SELECT COALESCE(SUM(p.monto),0) AS cobrado,COALESCE(SUM(p.recargo_pos),0) AS recargos,\n      COALESCE(SUM(p.comision_generada),0) AS comision,COALESCE(SUM(f.costo_aplicado),0) AS costos,\n      COALESCE(SUM(CASE WHEN f.regla='legacy_pendiente' THEN 1 ELSE 0 END),0) AS pendientes\n      FROM pagos_vigentes p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE p.fecha_pago BETWEEN ? AND ?",
    "postgres": "SELECT COALESCE(SUM(p.monto),0) AS cobrado,COALESCE(SUM(p.recargo_pos),0) AS recargos,\n      COALESCE(SUM(p.comision_generada),0) AS comision,COALESCE(SUM(f.costo_aplicado),0) AS costos,\n      COALESCE(SUM(CASE WHEN f.regla='legacy_pendiente' THEN 1 ELSE 0 END),0) AS pendientes\n      FROM pagos_vigentes p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE p.fecha_pago BETWEEN $1 AND $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-045",
    "mysql": "SELECT COALESCE(SUM(costo_total),0) AS total FROM consultas WHERE fecha_consulta BETWEEN ? AND ?",
    "postgres": "SELECT COALESCE(SUM(costo_total),0) AS total FROM consultas WHERE fecha_consulta BETWEEN $1 AND $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-046",
    "mysql": "SELECT g.*, u.nombre_completo AS registrado_por_nombre\n       FROM gastos_clinica g\n       LEFT JOIN usuarios u ON g.registrado_por = u.id\n       WHERE g.fecha_pago BETWEEN ? AND ?\n       ORDER BY g.fecha_pago DESC",
    "postgres": "SELECT g.*, u.nombre_completo AS registrado_por_nombre\n       FROM gastos_clinica g\n       LEFT JOIN usuarios u ON g.registrado_por = u.id\n       WHERE g.fecha_pago BETWEEN $1 AND $2\n       ORDER BY g.fecha_pago DESC",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-047",
    "mysql": "INSERT INTO gastos_clinica (categoria, descripcion, monto, fecha_pago, mes_consumo, registrado_por)\n       VALUES (?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO gastos_clinica (categoria, descripcion, monto, fecha_pago, mes_consumo, registrado_por)\n       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    "parameters": 6,
    "lock": false
  },
  {
    "id": "U3A-048",
    "mysql": "SELECT * FROM gastos_clinica WHERE id = ? FOR UPDATE",
    "postgres": "SELECT * FROM gastos_clinica WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-049",
    "mysql": "UPDATE gastos_clinica SET categoria=?, descripcion=?, monto=?, fecha_pago=?, mes_consumo=? WHERE id=?",
    "postgres": "UPDATE gastos_clinica SET categoria=$1, descripcion=$2, monto=$3, fecha_pago=$4, mes_consumo=$5 WHERE id=$6",
    "parameters": 6,
    "lock": false
  },
  {
    "id": "U3A-050",
    "mysql": "SELECT * FROM gastos_clinica WHERE id = ? FOR UPDATE",
    "postgres": "SELECT * FROM gastos_clinica WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-051",
    "mysql": "UPDATE gastos_clinica SET estado = 'anulado' WHERE id = ?",
    "postgres": "UPDATE gastos_clinica SET estado = 'anulado' WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-052",
    "mysql": "SELECT * FROM gastos_clinica WHERE id = ? FOR UPDATE",
    "postgres": "SELECT * FROM gastos_clinica WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-053",
    "mysql": "UPDATE gastos_clinica SET estado = 'activo' WHERE id = ?",
    "postgres": "UPDATE gastos_clinica SET estado = 'activo' WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-055",
    "mysql": "INSERT INTO penalidades_doctor (doctor_id, consulta_id, trabajo_laboratorio_id, monto, motivo, fecha, registrado_por)\n       VALUES (?, ?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO penalidades_doctor (doctor_id, consulta_id, trabajo_laboratorio_id, monto, motivo, fecha, registrado_por)\n       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    "parameters": 7,
    "lock": false
  },
  {
    "id": "U3A-057",
    "mysql": "SELECT h.*,\n                p.nombres, p.apellidos, p.dni, p.sexo,\n                p.fecha_nacimiento, p.domicilio, p.celular,\n                ap.nombre        AS apoderado_nombre,\n                ap.parentesco    AS parentesco,\n                ap.celular       AS apoderado_celular,\n                u.nombre_completo AS creado_por_nombre,\n                u.especialidad    AS doctor_especialidad,\n                u.cop             AS doctor_cop\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       LEFT JOIN apoderados ap ON p.id = ap.paciente_id\n       LEFT JOIN usuarios u ON h.creado_por = u.id\n       WHERE h.paciente_id = ?",
    "postgres": "SELECT h.*,\n                p.nombres, p.apellidos, p.dni, p.sexo,\n                p.fecha_nacimiento, p.domicilio, p.celular,\n                ap.nombre        AS apoderado_nombre,\n                ap.parentesco    AS parentesco,\n                ap.celular       AS apoderado_celular,\n                u.nombre_completo AS creado_por_nombre,\n                u.especialidad    AS doctor_especialidad,\n                u.cop             AS doctor_cop\n       FROM historias_clinicas h\n       JOIN pacientes p ON h.paciente_id = p.id\n       LEFT JOIN apoderados ap ON p.id = ap.paciente_id\n       LEFT JOIN usuarios u ON h.creado_por = u.id\n       WHERE h.paciente_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-058",
    "mysql": "SELECT * FROM antecedentes_medicos WHERE historia_id = ?",
    "postgres": "SELECT * FROM antecedentes_medicos WHERE historia_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-059",
    "mysql": "SELECT * FROM triaje WHERE historia_id = ? ORDER BY fecha_toma DESC LIMIT 1",
    "postgres": "SELECT * FROM triaje WHERE historia_id = $1 ORDER BY fecha_toma DESC LIMIT 1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-060",
    "mysql": "SELECT o.*, u.nombre_completo AS registrado_por_nombre\n       FROM odontograma_items o\n       LEFT JOIN usuarios u ON o.registrado_por = u.id\n       WHERE o.historia_id = ?\n       ORDER BY o.fecha_registro DESC",
    "postgres": "SELECT o.*, u.nombre_completo AS registrado_por_nombre\n       FROM odontograma_items o\n       LEFT JOIN usuarios u ON o.registrado_por = u.id\n       WHERE o.historia_id = $1\n       ORDER BY o.fecha_registro DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-061",
    "mysql": "SELECT a.*, u.nombre_completo AS usuario_nombre\n         FROM odontograma_adendas a LEFT JOIN usuarios u ON a.usuario_id = u.id\n         WHERE a.odontograma_item_id = ? ORDER BY a.creado_en ASC",
    "postgres": "SELECT a.*, u.nombre_completo AS usuario_nombre\n         FROM odontograma_adendas a LEFT JOIN usuarios u ON a.usuario_id = u.id\n         WHERE a.odontograma_item_id = $1 ORDER BY a.creado_en ASC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-062",
    "mysql": "SELECT c.*, u.nombre_completo AS doctor_nombre,\n              COALESCE((SELECT SUM(p.monto) FROM pagos_vigentes p WHERE p.consulta_id = c.id), 0) AS total_pagado\n       FROM consultas c\n       LEFT JOIN usuarios u ON c.doctor_id = u.id\n       WHERE c.historia_id = ?\n       ORDER BY c.fecha_consulta DESC",
    "postgres": "SELECT c.*, u.nombre_completo AS doctor_nombre,\n              COALESCE((SELECT SUM(p.monto) FROM pagos_vigentes p WHERE p.consulta_id = c.id), 0) AS total_pagado\n       FROM consultas c\n       LEFT JOIN usuarios u ON c.doctor_id = u.id\n       WHERE c.historia_id = $1\n       ORDER BY c.fecha_consulta DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-063",
    "mysql": "SELECT * FROM pagos_vigentes WHERE consulta_id = ? ORDER BY creado_en ASC",
    "postgres": "SELECT * FROM pagos_vigentes WHERE consulta_id = $1 ORDER BY creado_en ASC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-064",
    "mysql": "SELECT COALESCE(SUM(f.costo_aplicado),0) AS total\n          FROM finanzas_pagos f JOIN pagos_vigentes p ON p.id=f.pago_id WHERE p.consulta_id=?",
    "postgres": "SELECT COALESCE(SUM(f.costo_aplicado),0) AS total\n          FROM finanzas_pagos f JOIN pagos_vigentes p ON p.id=f.pago_id WHERE p.consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-065",
    "mysql": "SELECT origen FROM finanzas_costos WHERE consulta_id=?",
    "postgres": "SELECT origen FROM finanzas_costos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-066",
    "mysql": "SELECT a.*, u.nombre_completo AS usuario_nombre\n         FROM consultas_adendas a LEFT JOIN usuarios u ON a.usuario_id = u.id\n         WHERE a.consulta_id = ? ORDER BY a.creado_en ASC",
    "postgres": "SELECT a.*, u.nombre_completo AS usuario_nombre\n         FROM consultas_adendas a LEFT JOIN usuarios u ON a.usuario_id = u.id\n         WHERE a.consulta_id = $1 ORDER BY a.creado_en ASC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-067",
    "mysql": "SELECT * FROM firmas_consentimiento WHERE historia_id = ?",
    "postgres": "SELECT * FROM firmas_consentimiento WHERE historia_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-068",
    "mysql": "SELECT r.* FROM radiografias r\n       LEFT JOIN radiografias_anulaciones a ON a.radiografia_id=r.id AND a.restaurada_en IS NULL\n       WHERE r.historia_id = ? AND a.radiografia_id IS NULL ORDER BY r.creado_en DESC",
    "postgres": "SELECT r.* FROM radiografias r\n       LEFT JOIN radiografias_anulaciones a ON a.radiografia_id=r.id AND a.restaurada_en IS NULL\n       WHERE r.historia_id = $1 AND a.radiografia_id IS NULL ORDER BY r.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-069",
    "mysql": "SELECT r.*, u.nombre_completo AS doctor_nombre, u.especialidad AS doctor_especialidad,\n              u.cop AS doctor_cop, u.firma_digital AS doctor_firma, u.sello_digital AS doctor_sello,\n              ua.nombre_completo AS anulada_por_nombre\n       FROM recetas r\n       LEFT JOIN usuarios u ON r.doctor_id = u.id\n       LEFT JOIN usuarios ua ON r.anulada_por = ua.id\n       WHERE r.historia_id = ?\n       ORDER BY r.creado_en DESC",
    "postgres": "SELECT r.*, u.nombre_completo AS doctor_nombre, u.especialidad AS doctor_especialidad,\n              u.cop AS doctor_cop, u.firma_digital AS doctor_firma, u.sello_digital AS doctor_sello,\n              ua.nombre_completo AS anulada_por_nombre\n       FROM recetas r\n       LEFT JOIN usuarios u ON r.doctor_id = u.id\n       LEFT JOIN usuarios ua ON r.anulada_por = ua.id\n       WHERE r.historia_id = $1\n       ORDER BY r.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-070",
    "mysql": "SELECT o.*, u.nombre_completo AS doctor_nombre, u.especialidad AS doctor_especialidad,\n              u.cop AS doctor_cop, u.firma_digital AS doctor_firma, u.sello_digital AS doctor_sello,\n              ua.nombre_completo AS anulada_por_nombre,\n              c.nombre AS centro_nombre, c.sede AS centro_sede, c.direccion AS centro_direccion,\n              c.celular AS centro_celular, c.mapa_imagen_url AS centro_mapa\n       FROM ordenes_radiografia o\n       LEFT JOIN usuarios u ON o.doctor_id = u.id\n       LEFT JOIN usuarios ua ON o.anulada_por = ua.id\n       LEFT JOIN centros_referencia c ON o.centro_referencia_id = c.id\n       WHERE o.historia_id = ?\n       ORDER BY o.creado_en DESC",
    "postgres": "SELECT o.*, u.nombre_completo AS doctor_nombre, u.especialidad AS doctor_especialidad,\n              u.cop AS doctor_cop, u.firma_digital AS doctor_firma, u.sello_digital AS doctor_sello,\n              ua.nombre_completo AS anulada_por_nombre,\n              c.nombre AS centro_nombre, c.sede AS centro_sede, c.direccion AS centro_direccion,\n              c.celular AS centro_celular, c.mapa_imagen_url AS centro_mapa\n       FROM ordenes_radiografia o\n       LEFT JOIN usuarios u ON o.doctor_id = u.id\n       LEFT JOIN usuarios ua ON o.anulada_por = ua.id\n       LEFT JOIN centros_referencia c ON o.centro_referencia_id = c.id\n       WHERE o.historia_id = $1\n       ORDER BY o.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-071",
    "mysql": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_historias a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       WHERE a.historia_id = ? ORDER BY a.creado_en DESC",
    "postgres": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_historias a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       WHERE a.historia_id = $1 ORDER BY a.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-072",
    "mysql": "UPDATE antecedentes_medicos SET\n        motivo_consulta = ?, antecedentes_medicos = ?,\n        antecedentes_quirurgicos = ?, antecedentes_odontologicos = ?,\n        diagnostico = ?, plan_tratamiento = ?, examen_clinico = ?\n       WHERE historia_id = ?",
    "postgres": "UPDATE antecedentes_medicos SET\n        motivo_consulta = $1, antecedentes_medicos = $2,\n        antecedentes_quirurgicos = $3, antecedentes_odontologicos = $4,\n        diagnostico = $5, plan_tratamiento = $6, examen_clinico = $7\n       WHERE historia_id = $8",
    "parameters": 8,
    "lock": false
  },
  {
    "id": "U3A-073",
    "mysql": "INSERT INTO triaje\n          (historia_id, presion, pulso, temperatura, fc, fr, fecha_toma, registrado_por)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO triaje\n          (historia_id, presion, pulso, temperatura, fc, fr, fecha_toma, registrado_por)\n         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    "parameters": 8,
    "lock": false
  },
  {
    "id": "U3A-074",
    "mysql": "INSERT INTO auditoria_historias\n        (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias\n        (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-076",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-077",
    "mysql": "SELECT historia_id, bloqueada FROM odontograma_items WHERE id = ?",
    "postgres": "SELECT historia_id, bloqueada FROM odontograma_items WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-078",
    "mysql": "INSERT INTO odontograma_adendas (odontograma_item_id, usuario_id, motivo, contenido) VALUES (?, ?, ?, ?)",
    "postgres": "INSERT INTO odontograma_adendas (odontograma_item_id, usuario_id, motivo, contenido) VALUES ($1, $2, $3, $4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-079",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-080",
    "mysql": "SELECT o.historia_id, o.pieza, o.estado_nombre, o.registrado_por,\n              (SELECT COUNT(*) FROM odontograma_adendas WHERE odontograma_item_id = o.id) AS total_adendas\n       FROM odontograma_items o WHERE o.id = ?",
    "postgres": "SELECT o.historia_id, o.pieza, o.estado_nombre, o.registrado_por,\n              (SELECT COUNT(*) FROM odontograma_adendas WHERE odontograma_item_id = o.id) AS total_adendas\n       FROM odontograma_items o WHERE o.id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-081",
    "mysql": "DELETE FROM odontograma_items WHERE id = ?",
    "postgres": "DELETE FROM odontograma_items WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-082",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-083",
    "mysql": "SELECT id FROM historias_clinicas WHERE paciente_id = ?",
    "postgres": "SELECT id FROM historias_clinicas WHERE paciente_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-085",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-086",
    "mysql": "SELECT id FROM historias_clinicas WHERE paciente_id = ?",
    "postgres": "SELECT id FROM historias_clinicas WHERE paciente_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-088",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-089",
    "mysql": "SELECT id FROM historias_clinicas WHERE id=? FOR UPDATE",
    "postgres": "SELECT id FROM historias_clinicas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-090",
    "mysql": "INSERT INTO radiografias\n        (historia_id, tipo, descripcion, url_archivo, fecha_toma, subido_por)\n       VALUES (?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO radiografias\n        (historia_id, tipo, descripcion, url_archivo, fecha_toma, subido_por)\n       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    "parameters": 6,
    "lock": false
  },
  {
    "id": "U3A-091",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-093",
    "mysql": "SELECT historia_id, descripcion FROM radiografias WHERE id=? FOR UPDATE",
    "postgres": "SELECT historia_id, descripcion FROM radiografias WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-094",
    "mysql": "SELECT restaurada_en FROM radiografias_anulaciones WHERE radiografia_id=?",
    "postgres": "SELECT restaurada_en FROM radiografias_anulaciones WHERE radiografia_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-096",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-097",
    "mysql": "SELECT historia_id, descripcion, url_archivo FROM radiografias WHERE id=? FOR UPDATE",
    "postgres": "SELECT historia_id, descripcion, url_archivo FROM radiografias WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-098",
    "mysql": "SELECT restaurada_en FROM radiografias_anulaciones WHERE radiografia_id=?",
    "postgres": "SELECT restaurada_en FROM radiografias_anulaciones WHERE radiografia_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-099",
    "mysql": "UPDATE radiografias_anulaciones SET restaurada_por=?,restaurada_en=NOW() WHERE radiografia_id=?",
    "postgres": "UPDATE radiografias_anulaciones SET restaurada_por=$1,restaurada_en=NOW() WHERE radiografia_id=$2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-100",
    "mysql": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion)\n      VALUES(?,?,?,?,?)",
    "postgres": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion)\n      VALUES($1,$2,$3,$4,$5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-101",
    "mysql": "SELECT id, firma_paciente_data, firma_doctor_data FROM firmas_consentimiento WHERE historia_id = ? FOR UPDATE",
    "postgres": "SELECT id, firma_paciente_data, firma_doctor_data FROM firmas_consentimiento WHERE historia_id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-102",
    "mysql": "UPDATE firmas_consentimiento SET\n          firma_paciente_data = ?, firma_doctor_data = ?, fecha_firma = ?\n         WHERE historia_id = ?",
    "postgres": "UPDATE firmas_consentimiento SET\n          firma_paciente_data = $1, firma_doctor_data = $2, fecha_firma = $3\n         WHERE historia_id = $4",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-103",
    "mysql": "INSERT INTO firmas_consentimiento\n          (historia_id, firma_paciente_data, firma_doctor_data, fecha_firma)\n         VALUES (?, ?, ?, ?)",
    "postgres": "INSERT INTO firmas_consentimiento\n          (historia_id, firma_paciente_data, firma_doctor_data, fecha_firma)\n         VALUES ($1, $2, $3, $4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-104",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n         VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n         VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-105",
    "mysql": "SELECT historia_id, bloqueada FROM consultas WHERE id = ?",
    "postgres": "SELECT historia_id, bloqueada FROM consultas WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-106",
    "mysql": "UPDATE consultas SET descripcion=?, costo_total=?, fecha_consulta=? WHERE id=?",
    "postgres": "UPDATE consultas SET descripcion=$1, costo_total=$2, fecha_consulta=$3 WHERE id=$4",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-107",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-108",
    "mysql": "SELECT historia_id, bloqueada FROM consultas WHERE id = ?",
    "postgres": "SELECT historia_id, bloqueada FROM consultas WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-109",
    "mysql": "INSERT INTO consultas_adendas (consulta_id, usuario_id, motivo, contenido) VALUES (?, ?, ?, ?)",
    "postgres": "INSERT INTO consultas_adendas (consulta_id, usuario_id, motivo, contenido) VALUES ($1, $2, $3, $4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-110",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-113",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-114",
    "mysql": "SELECT historia_id, anulada FROM ordenes_radiografia WHERE id = ? FOR UPDATE",
    "postgres": "SELECT historia_id, anulada FROM ordenes_radiografia WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-117",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-119",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-120",
    "mysql": "SELECT historia_id, anulada FROM recetas WHERE id = ? FOR UPDATE",
    "postgres": "SELECT historia_id, anulada FROM recetas WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-123",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-124",
    "mysql": "SELECT historia_id, descripcion, bloqueada FROM consultas WHERE id = ?",
    "postgres": "SELECT historia_id, descripcion, bloqueada FROM consultas WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-125",
    "mysql": "SELECT COUNT(*) AS total FROM pagos WHERE consulta_id=?",
    "postgres": "SELECT COUNT(*) AS total FROM pagos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-126",
    "mysql": "DELETE FROM consultas WHERE id = ?",
    "postgres": "DELETE FROM consultas WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-127",
    "mysql": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-128",
    "mysql": "SELECT t.*, u.nombre_completo AS registrado_por_nombre\n       FROM trabajos_laboratorio t\n       LEFT JOIN usuarios u ON t.registrado_por = u.id\n       WHERE t.consulta_id = ? ORDER BY t.creado_en DESC",
    "postgres": "SELECT t.*, u.nombre_completo AS registrado_por_nombre\n       FROM trabajos_laboratorio t\n       LEFT JOIN usuarios u ON t.registrado_por = u.id\n       WHERE t.consulta_id = $1 ORDER BY t.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-129",
    "mysql": "SELECT * FROM pagos_laboratorio WHERE trabajo_laboratorio_id = ? ORDER BY fecha_pago ASC",
    "postgres": "SELECT * FROM pagos_laboratorio WHERE trabajo_laboratorio_id = $1 ORDER BY fecha_pago ASC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-131",
    "mysql": "SELECT id FROM consultas WHERE id=? FOR UPDATE",
    "postgres": "SELECT id FROM consultas WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-132",
    "mysql": "INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,descripcion,registrado_por) VALUES(?,?,?,?,?)",
    "postgres": "INSERT INTO trabajos_laboratorio(consulta_id,nombre_laboratorio,monto_total,descripcion,registrado_por) VALUES($1,$2,$3,$4,$5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-133",
    "mysql": "SELECT monto_total,nombre_laboratorio FROM trabajos_laboratorio WHERE id=? FOR UPDATE",
    "postgres": "SELECT monto_total,nombre_laboratorio FROM trabajos_laboratorio WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-134",
    "mysql": "SELECT COALESCE(SUM(monto),0) AS pagado FROM pagos_laboratorio WHERE trabajo_laboratorio_id=?",
    "postgres": "SELECT COALESCE(SUM(monto),0) AS pagado FROM pagos_laboratorio WHERE trabajo_laboratorio_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-135",
    "mysql": "INSERT INTO pagos_laboratorio(trabajo_laboratorio_id,monto,fecha_pago,registrado_por) VALUES(?,?,?,?)",
    "postgres": "INSERT INTO pagos_laboratorio(trabajo_laboratorio_id,monto,fecha_pago,registrado_por) VALUES($1,$2,$3,$4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-137",
    "mysql": "SELECT p.*, a.nombre AS apoderado_nombre, a.parentesco, a.celular AS apoderado_celular\n       FROM pacientes p\n       LEFT JOIN apoderados a ON p.id = a.paciente_id\n       WHERE p.id = ?",
    "postgres": "SELECT p.*, a.nombre AS apoderado_nombre, a.parentesco, a.celular AS apoderado_celular\n       FROM pacientes p\n       LEFT JOIN apoderados a ON p.id = a.paciente_id\n       WHERE p.id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-138",
    "mysql": "SELECT id FROM pacientes WHERE dni = ?",
    "postgres": "SELECT id FROM pacientes WHERE dni = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-139",
    "mysql": "INSERT INTO pacientes (dni, nombres, apellidos, sexo, fecha_nacimiento,\n        domicilio, celular, fecha_registro, hora_registro, registrado_por)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO pacientes (dni, nombres, apellidos, sexo, fecha_nacimiento,\n        domicilio, celular, fecha_registro, hora_registro, registrado_por)\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
    "parameters": 10,
    "lock": false
  },
  {
    "id": "U3A-140",
    "mysql": "INSERT INTO historias_clinicas\n       (paciente_id, nro_historia, fecha_creacion, hora_creacion, creado_por)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO historias_clinicas\n       (paciente_id, nro_historia, fecha_creacion, hora_creacion, creado_por)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-141",
    "mysql": "UPDATE historias_clinicas SET nro_historia = ? WHERE id = ?",
    "postgres": "UPDATE historias_clinicas SET nro_historia = $1 WHERE id = $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-142",
    "mysql": "INSERT INTO antecedentes_medicos (historia_id) VALUES (?)",
    "postgres": "INSERT INTO antecedentes_medicos (historia_id) VALUES ($1) RETURNING id",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-143",
    "mysql": "INSERT INTO auditoria_historias\n       (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_historias\n       (historia_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-144",
    "mysql": "INSERT INTO apoderados (paciente_id, nombre, parentesco, celular) VALUES (?, ?, ?, ?)",
    "postgres": "INSERT INTO apoderados (paciente_id, nombre, parentesco, celular) VALUES ($1, $2, $3, $4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-145",
    "mysql": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-146",
    "mysql": "SELECT id FROM pacientes WHERE id = ? FOR UPDATE",
    "postgres": "SELECT id FROM pacientes WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-147",
    "mysql": "UPDATE pacientes SET dni=?, nombres=?, apellidos=?, sexo=?,\n       fecha_nacimiento=?, domicilio=?, celular=? WHERE id=?",
    "postgres": "UPDATE pacientes SET dni=$1, nombres=$2, apellidos=$3, sexo=$4,\n       fecha_nacimiento=$5, domicilio=$6, celular=$7 WHERE id=$8",
    "parameters": 8,
    "lock": false
  },
  {
    "id": "U3A-148",
    "mysql": "SELECT id FROM apoderados WHERE paciente_id = ?",
    "postgres": "SELECT id FROM apoderados WHERE paciente_id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-149",
    "mysql": "UPDATE apoderados SET nombre=?, parentesco=?, celular=? WHERE paciente_id=?",
    "postgres": "UPDATE apoderados SET nombre=$1, parentesco=$2, celular=$3 WHERE paciente_id=$4",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-150",
    "mysql": "INSERT INTO apoderados (paciente_id, nombre, parentesco, celular) VALUES (?,?,?,?)",
    "postgres": "INSERT INTO apoderados (paciente_id, nombre, parentesco, celular) VALUES ($1,$2,$3,$4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-151",
    "mysql": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n         VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n         VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-152",
    "mysql": "SELECT id FROM pacientes WHERE id = ?",
    "postgres": "SELECT id FROM pacientes WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-155",
    "mysql": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-156",
    "mysql": "SELECT id FROM pacientes WHERE id = ?",
    "postgres": "SELECT id FROM pacientes WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-159",
    "mysql": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES (?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_pacientes (paciente_id, usuario_id, accion, fecha_accion, hora_accion)\n       VALUES ($1, $2, $3, $4, $5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-160",
    "mysql": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_pacientes a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       WHERE a.paciente_id = ?\n       ORDER BY a.creado_en DESC",
    "postgres": "SELECT a.*, u.nombre_completo AS usuario_nombre\n       FROM auditoria_pacientes a\n       LEFT JOIN usuarios u ON a.usuario_id = u.id\n       WHERE a.paciente_id = $1\n       ORDER BY a.creado_en DESC",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-161",
    "mysql": "SELECT recargo_pos_porcentaje AS porcentaje, revision FROM finanzas_configuracion WHERE id=1",
    "postgres": "SELECT recargo_pos_porcentaje AS porcentaje, revision FROM finanzas_configuracion WHERE id=1",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-162",
    "mysql": "SELECT recargo_pos_porcentaje,revision FROM finanzas_configuracion WHERE id=1 FOR UPDATE",
    "postgres": "SELECT recargo_pos_porcentaje,revision FROM finanzas_configuracion WHERE id=1 FOR UPDATE",
    "parameters": 0,
    "lock": true
  },
  {
    "id": "U3A-163",
    "mysql": "UPDATE finanzas_configuracion SET recargo_pos_porcentaje=?,revision=? WHERE id=1",
    "postgres": "UPDATE finanzas_configuracion SET recargo_pos_porcentaje=$1,revision=$2 WHERE id=1",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-165",
    "mysql": "SELECT id,nombre_completo,activo FROM usuarios u\n      WHERE rol='Doctor' OR EXISTS(SELECT 1 FROM consultas c WHERE c.doctor_id=u.id) ORDER BY nombre_completo",
    "postgres": "SELECT id,nombre_completo,activo FROM usuarios u\n      WHERE rol='Doctor' OR EXISTS(SELECT 1 FROM consultas c WHERE c.doctor_id=u.id) ORDER BY nombre_completo",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-169",
    "mysql": "SELECT id, nombre, nombre_completo, prefix, gender, rol, is_admin,\n      nivel, dni, telefono, email, especialidad, cop, direccion, activo, comision_porcentaje\n      FROM usuarios ORDER BY nivel DESC, nombre_completo ASC",
    "postgres": "SELECT id, nombre, nombre_completo, prefix, gender, rol, is_admin,\n      nivel, dni, telefono, email, especialidad, cop, direccion, activo, comision_porcentaje\n      FROM usuarios ORDER BY nivel DESC, nombre_completo ASC",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-173",
    "mysql": "SELECT firma_digital, sello_digital FROM usuarios WHERE id = ?",
    "postgres": "SELECT firma_digital, sello_digital FROM usuarios WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-174",
    "mysql": "UPDATE usuarios SET firma_digital = ?, sello_digital = ? WHERE id = ?",
    "postgres": "UPDATE usuarios SET firma_digital = $1, sello_digital = $2 WHERE id = $3",
    "parameters": 3,
    "lock": false
  },
  {
    "id": "U3A-176",
    "mysql": "SELECT 1 AS health_check",
    "postgres": "SELECT 1 AS health_check",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-177",
    "mysql": "SELECT pago_id, costo_aplicado, anulado FROM finanzas_pagos LIMIT 0",
    "postgres": "SELECT pago_id, costo_aplicado, anulado FROM finanzas_pagos LIMIT 0",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-178",
    "mysql": "SELECT id FROM pagos_vigentes LIMIT 0",
    "postgres": "SELECT id FROM pagos_vigentes LIMIT 0",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-179",
    "mysql": "SELECT consulta_id, otros_costos FROM finanzas_costos LIMIT 0",
    "postgres": "SELECT consulta_id, otros_costos FROM finanzas_costos LIMIT 0",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-180",
    "mysql": "SELECT clave, huella FROM finanzas_peticiones LIMIT 0",
    "postgres": "SELECT clave, huella FROM finanzas_peticiones LIMIT 0",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-181",
    "mysql": "SELECT version FROM finanzas_version WHERE version IN ('001','002')",
    "postgres": "SELECT version FROM finanzas_version WHERE version IN ('001','002')",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-182",
    "mysql": "SELECT revision FROM finanzas_configuracion WHERE id=1",
    "postgres": "SELECT revision FROM finanzas_configuracion WHERE id=1",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-183",
    "mysql": "SELECT pago_id,porcentaje,revision FROM finanzas_pago_pos LIMIT 0",
    "postgres": "SELECT pago_id,porcentaje,revision FROM finanzas_pago_pos LIMIT 0",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "U3A-184",
    "mysql": "SELECT r.url_archivo FROM radiografias r\n        INNER JOIN historias_clinicas h ON h.id=r.historia_id\n        LEFT JOIN radiografias_anulaciones a ON a.radiografia_id=r.id AND a.restaurada_en IS NULL\n        WHERE r.id=? AND a.radiografia_id IS NULL",
    "postgres": "SELECT r.url_archivo FROM radiografias r\n        INNER JOIN historias_clinicas h ON h.id=r.historia_id\n        LEFT JOIN radiografias_anulaciones a ON a.radiografia_id=r.id AND a.restaurada_en IS NULL\n        WHERE r.id=$1 AND a.radiografia_id IS NULL",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-186",
    "mysql": "SELECT huella, respuesta FROM finanzas_peticiones WHERE usuario_id=? AND clave=? FOR UPDATE",
    "postgres": "SELECT huella, respuesta FROM finanzas_peticiones WHERE usuario_id=$1 AND clave=$2 FOR UPDATE",
    "parameters": 2,
    "lock": true
  },
  {
    "id": "U3A-187",
    "mysql": "UPDATE finanzas_peticiones SET respuesta=? WHERE usuario_id=? AND clave=?",
    "postgres": "UPDATE finanzas_peticiones SET respuesta=$1 WHERE usuario_id=$2 AND clave=$3",
    "parameters": 3,
    "lock": false
  },
  {
    "id": "U3A-188",
    "mysql": "SELECT COALESCE(SUM(monto_total),0) AS total FROM trabajos_laboratorio WHERE consulta_id=?",
    "postgres": "SELECT COALESCE(SUM(monto_total),0) AS total FROM trabajos_laboratorio WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-189",
    "mysql": "SELECT otros_costos FROM finanzas_costos WHERE consulta_id=?",
    "postgres": "SELECT otros_costos FROM finanzas_costos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-190",
    "mysql": "SELECT p.* FROM pagos p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id\n    WHERE p.consulta_id=? AND f.pago_id IS NULL ORDER BY p.id",
    "postgres": "SELECT p.* FROM pagos p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id\n    WHERE p.consulta_id=$1 AND f.pago_id IS NULL ORDER BY p.id",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-191",
    "mysql": "UPDATE finanzas_costos SET origen='legacy_pendiente' WHERE consulta_id=?",
    "postgres": "UPDATE finanzas_costos SET origen='legacy_pendiente' WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-192",
    "mysql": "INSERT INTO finanzas_pagos(pago_id,doctor_id,porcentaje,costo_aplicado,base_comisionable,margen_clinica,regla)\n      VALUES(?,?,?,?,?,?,?)",
    "postgres": "INSERT INTO finanzas_pagos(pago_id,doctor_id,porcentaje,costo_aplicado,base_comisionable,margen_clinica,regla)\n      VALUES($1,$2,$3,$4,$5,$6,$7)",
    "parameters": 7,
    "lock": false
  },
  {
    "id": "U3A-193",
    "mysql": "SELECT origen FROM finanzas_costos WHERE consulta_id=?",
    "postgres": "SELECT origen FROM finanzas_costos WHERE consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-194",
    "mysql": "SELECT COALESCE(SUM(p.monto),0) AS paid, COALESCE(SUM(f.costo_aplicado),0) AS used\n    FROM pagos_vigentes p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE p.consulta_id=?",
    "postgres": "SELECT COALESCE(SUM(p.monto),0) AS paid, COALESCE(SUM(f.costo_aplicado),0) AS used\n    FROM pagos_vigentes p LEFT JOIN finanzas_pagos f ON f.pago_id=p.id WHERE p.consulta_id=$1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-195",
    "mysql": "SELECT comision_porcentaje FROM usuarios WHERE id=? LOCK IN SHARE MODE",
    "postgres": "SELECT comision_porcentaje FROM usuarios WHERE id=$1 FOR SHARE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-196",
    "mysql": "SELECT recargo_pos_porcentaje,revision FROM finanzas_configuracion WHERE id=1 LOCK IN SHARE MODE",
    "postgres": "SELECT recargo_pos_porcentaje,revision FROM finanzas_configuracion WHERE id=1 FOR SHARE",
    "parameters": 0,
    "lock": true
  },
  {
    "id": "U3A-197",
    "mysql": "INSERT INTO pagos(consulta_id,monto,metodo_pago,recargo_pos,comision_generada,fecha_pago,hora_pago,registrado_por)\n    VALUES(?,?,?,?,?,?,?,?)",
    "postgres": "INSERT INTO pagos(consulta_id,monto,metodo_pago,recargo_pos,comision_generada,fecha_pago,hora_pago,registrado_por)\n    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id",
    "parameters": 8,
    "lock": false
  },
  {
    "id": "U3A-198",
    "mysql": "INSERT INTO finanzas_pago_pos(pago_id,porcentaje,revision) VALUES(?,?,?)",
    "postgres": "INSERT INTO finanzas_pago_pos(pago_id,porcentaje,revision) VALUES($1,$2,$3)",
    "parameters": 3,
    "lock": false
  },
  {
    "id": "U3A-199",
    "mysql": "INSERT INTO finanzas_pagos(pago_id,doctor_id,porcentaje,costo_aplicado,base_comisionable,margen_clinica,regla)\n    VALUES(?,?,?,?,?,?, 'costo_primero_v1')",
    "postgres": "INSERT INTO finanzas_pagos(pago_id,doctor_id,porcentaje,costo_aplicado,base_comisionable,margen_clinica,regla)\n    VALUES($1,$2,$3,$4,$5,$6, 'costo_primero_v1')",
    "parameters": 6,
    "lock": false
  },
  {
    "id": "U3A-200",
    "mysql": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES(?,?,?,?,?)",
    "postgres": "INSERT INTO auditoria_historias(historia_id,usuario_id,accion,fecha_accion,hora_accion) VALUES($1,$2,$3,$4,$5) RETURNING id",
    "parameters": 5,
    "lock": false
  },
  {
    "id": "U3A-201",
    "mysql": "SELECT id, password_hash, auth_version, activo, nivel, is_admin, rol, nombre, nombre_completo, prefix, gender, especialidad, cop FROM usuarios WHERE id = ?",
    "postgres": "SELECT id, password_hash, auth_version, activo, nivel, is_admin, rol, nombre, nombre_completo, prefix, gender, especialidad, cop FROM usuarios WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-201-LOCK",
    "mysql": "SELECT id, password_hash, auth_version, activo, nivel, is_admin, rol, nombre, nombre_completo, prefix, gender, especialidad, cop FROM usuarios WHERE id = ? FOR UPDATE",
    "postgres": "SELECT id, password_hash, auth_version, activo, nivel, is_admin, rol, nombre, nombre_completo, prefix, gender, especialidad, cop FROM usuarios WHERE id = $1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "U3A-202",
    "mysql": "UPDATE usuarios SET auth_version = auth_version + 1 WHERE id = ?",
    "postgres": "UPDATE usuarios SET auth_version = auth_version + 1 WHERE id = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-203",
    "mysql": "UPDATE seguridad_sesiones SET revocada_en = CURRENT_TIMESTAMP(3) WHERE usuario_id = ? AND revocada_en IS NULL",
    "postgres": "UPDATE seguridad_sesiones SET revocada_en = CURRENT_TIMESTAMP(3) WHERE usuario_id = $1 AND revocada_en IS NULL",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-204",
    "mysql": "SELECT usuario_id, auth_version, expira_epoch, revocada_en\n      FROM seguridad_sesiones WHERE token_hash = ?",
    "postgres": "SELECT usuario_id, auth_version, expira_epoch, revocada_en\n      FROM seguridad_sesiones WHERE token_hash = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-205",
    "mysql": "INSERT INTO seguridad_sesiones (token_hash, usuario_id, auth_version, expira_epoch) VALUES (?, ?, ?, ?)",
    "postgres": "INSERT INTO seguridad_sesiones (token_hash, usuario_id, auth_version, expira_epoch) VALUES ($1, $2, $3, $4)",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "U3A-206",
    "mysql": "UPDATE seguridad_sesiones SET revocada_en = CURRENT_TIMESTAMP(3) WHERE token_hash = ?",
    "postgres": "UPDATE seguridad_sesiones SET revocada_en = CURRENT_TIMESTAMP(3) WHERE token_hash = $1",
    "parameters": 1,
    "lock": false
  },
  {
    "id": "U3A-207",
    "mysql": "UPDATE usuarios SET password_hash = ? WHERE id = ?",
    "postgres": "UPDATE usuarios SET password_hash = $1 WHERE id = $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-209",
    "mysql": "UPDATE usuarios SET password_hash = ? WHERE id = ?",
    "postgres": "UPDATE usuarios SET password_hash = $1 WHERE id = $2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "U3A-210",
    "mysql": "INSERT INTO auditoria_financiera (usuario_id, modulo, accion, detalle_json, fecha, hora)\n     VALUES (?, ?, ?, ?, ?, ?)",
    "postgres": "INSERT INTO auditoria_financiera (usuario_id, modulo, accion, detalle_json, fecha, hora)\n     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    "parameters": 6,
    "lock": false
  },
  {
    "id": "U3A-211",
    "mysql": "INSERT INTO seguridad_eventos (accion, usuario_id, objetivo_id) VALUES (?, ?, ?)",
    "postgres": "INSERT INTO seguridad_eventos (accion, usuario_id, objetivo_id) VALUES ($1, $2, $3) RETURNING id",
    "parameters": 3,
    "lock": false
  }
];

statements.push(...require('./postgresPending').statements);
statements.push(...require('./insumosStatements'));
const bySql = new Map(statements.map(statement => [statement.mysql, statement]));
function resolveQuery(sql, values = []) {
  const statement = bySql.get(sql);
  if (!statement) throw Object.assign(new Error('SQL_COMPATIBILITY_PENDING'), { code: 'SCHEMA_PENDING' });
  if (!Array.isArray(values) || values.length !== statement.parameters || values.includes(undefined)) {
    throw Object.assign(new Error('DB_PARAMETERS_INVALID'), { code: 'DB_PARAMETERS_INVALID' });
  }
  return { text: statement.postgres, values, lock: statement.lock,
    ...(statement.sessionLock ? { sessionLock: statement.sessionLock } : {}) };
}
module.exports = { resolveQuery, statements };
