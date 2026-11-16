-- Exclusively fictitious U3-B test data. Never import clinical records.
-- Supply distinct, generated bcrypt hashes via the university bootstrap helper.
BEGIN;
SET LOCAL TIME ZONE 'America/Lima';
SET LOCAL search_path TO public;
DO $u3b$
BEGIN
  IF current_database() <> 'micodent_university_u3b_test'
     OR current_user <> 'micodent_university_u3b_owner'
     OR (inet_server_addr() IS NOT NULL AND inet_server_addr() NOT IN ('127.0.0.1'::inet, '::1'::inet))
     OR EXISTS (SELECT 1 FROM pg_roles WHERE rolname=current_user AND (rolsuper OR rolcreaterole OR rolreplication))
  THEN RAISE EXCEPTION 'U3B_TARGET_REQUIRED'; END IF;
END;
$u3b$;
DO $fresh_seed$
BEGIN
  IF COALESCE(current_setting('micodent.seed_admin_hash', true), '')
         !~ '^[$]2[aby][$][0-9]{2}[$][./A-Za-z0-9]{53}$'
     OR COALESCE(current_setting('micodent.seed_doctor_hash', true), '')
         !~ '^[$]2[aby][$][0-9]{2}[$][./A-Za-z0-9]{53}$'
     OR current_setting('micodent.seed_admin_hash') = current_setting('micodent.seed_doctor_hash')
  THEN RAISE EXCEPTION 'U3B_GENERATED_SEED_HASHES_REQUIRED'; END IF;
  IF EXISTS (SELECT 1 FROM usuarios) OR EXISTS (SELECT 1 FROM pacientes)
  THEN RAISE EXCEPTION 'U3B_EMPTY_SEED_TARGET_REQUIRED'; END IF;
END;
$fresh_seed$;

INSERT INTO usuarios(id,password_hash,nombre,nombre_completo,prefix,gender,rol,is_admin,nivel,especialidad,comision_porcentaje)
VALUES
('synthu3b_admin',current_setting('micodent.seed_admin_hash'),'FICTICIO ADMIN U3B','PERSONAL FICTICIO ADMIN U3B','Dr.','o','Doctor',TRUE,3,'ESPECIALIDAD FICTICIA',30.00),
('synthu3b_doctor',current_setting('micodent.seed_doctor_hash'),'FICTICIO DOCTOR U3B','PERSONAL FICTICIO DOCTOR U3B','Dr.','o','Doctor',FALSE,1,'ESPECIALIDAD FICTICIA',25.00);

INSERT INTO pacientes(dni,nombres,apellidos,sexo,fecha_nacimiento,fecha_registro,hora_registro,registrado_por)
VALUES('00000001','PACIENTE FICTICIO U3B','SOLO PRUEBA','F','1990-01-01','2026-10-04','09:00:00','synthu3b_admin');

INSERT INTO historias_clinicas(paciente_id,nro_historia,fecha_creacion,hora_creacion,creado_por)
SELECT id,'U3B-HC-SYNTHETIC','2026-10-04','09:00:00','synthu3b_admin' FROM pacientes WHERE dni='00000001';

INSERT INTO antecedentes_medicos(historia_id,motivo_consulta,diagnostico)
SELECT id,'CONSULTA EXCLUSIVAMENTE FICTICIA','DIAGNOSTICO DE PRUEBA, NO CLINICO' FROM historias_clinicas WHERE nro_historia='U3B-HC-SYNTHETIC';

INSERT INTO consultas(historia_id,descripcion,costo_total,fecha_consulta,doctor_id,comision_porcentaje_aplicado,bloqueada)
SELECT id,'TRATAMIENTO FICTICIO U3B',100.00,'2026-10-04','synthu3b_doctor',25.00,TRUE FROM historias_clinicas WHERE nro_historia='U3B-HC-SYNTHETIC';

INSERT INTO finanzas_costos(consulta_id,otros_costos,origen)
SELECT id,0.00,'costo_primero_v1' FROM consultas WHERE descripcion='TRATAMIENTO FICTICIO U3B';

INSERT INTO pagos(consulta_id,monto,comision_generada,fecha_pago,hora_pago,registrado_por)
SELECT id,20.00,5.00,'2026-10-04','09:00:00','synthu3b_admin' FROM consultas WHERE descripcion='TRATAMIENTO FICTICIO U3B';

INSERT INTO finanzas_pagos(pago_id,doctor_id,porcentaje,costo_aplicado,base_comisionable,margen_clinica,regla)
SELECT p.id,'synthu3b_doctor',25.00,0.00,20.00,15.00,'costo_primero_v1'
FROM pagos p JOIN consultas c ON c.id=p.consulta_id WHERE c.descripcion='TRATAMIENTO FICTICIO U3B';

INSERT INTO citas(paciente_id,nombre_contacto,celular_contacto,doctor_id,fecha,hora_inicio,duracion_minutos,creado_por)
SELECT id,'CONTACTO FICTICIO U3B','000000000','synthu3b_doctor','2026-10-04','10:00:00',30,'synthu3b_admin'
FROM pacientes WHERE dni='00000001';

-- No clinical images, base64 signatures, reference maps or historical records.
COMMIT;
