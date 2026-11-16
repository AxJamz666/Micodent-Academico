# OPE-01 · Admisión y gestión de pacientes

Registro, búsqueda y actualización de ficha.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!9`. Estado de la matriz «Existente reportado».

## Alcance observado

Alta, búsqueda, consulta y actualización conectan UI, API y persistencia. Las rutas incluyen auditoría por paciente.

Verificar duplicado simultáneo, permisos con usuarios distintos y contenido de auditoría sobre datos sintéticos.

Estado consignado en la matriz «Existente reportado».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Frontend | [frontend/web/src/pages/PacienteDetalle.jsx](../../../../frontend/web/src/pages/PacienteDetalle.jsx) | MIC-BOLT-009, MIC-BOLT-011 |
| Frontend | [frontend/web/src/pages/Pacientes.jsx](../../../../frontend/web/src/pages/Pacientes.jsx) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Backend | [backend/api/src/controllers/pacientes.controller.js](../../../../backend/api/src/controllers/pacientes.controller.js) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Rutas API | [backend/api/src/routes/pacientes.routes.js](../../../../backend/api/src/routes/pacientes.routes.js) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Base de datos | [database/init.sql](../../../../database/init.sql) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Pruebas | [backend/api/tests/unit/academic-a-patients.test.cjs](../../../../backend/api/tests/unit/academic-a-patients.test.cjs) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Pruebas | [backend/api/tests/unit/academic-b-patients.test.cjs](../../../../backend/api/tests/unit/academic-b-patients.test.cjs) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |
| Pruebas | [frontend/web/tests/academic-a-patient.test.mjs](../../../../frontend/web/tests/academic-a-patient.test.mjs) | MIC-BOLT-009, MIC-BOLT-010, MIC-BOLT-011 |

Filas clínicas históricas en el inventario local · 12. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-04` · `AP-01`, `AP-04`, `AP-07`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-009](PRUEBAS.md#tc-009) | PR-009 · Registrar paciente | TC-009 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-010](PRUEBAS.md#tc-010) | PR-010 · Buscar y consultar ficha de paciente | TC-010 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-011](PRUEBAS.md#tc-011) | PR-011 · Actualizar información de paciente | TC-011 | Código identificado | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-04 | Registro y búsqueda controlados | Validación, duplicados y permisos | R19, R20, R21, R31 |

- **R19** · Streamlining Dental Clinic Management for Effective Digitisation Productivity and Usability. Desarrolla sistema con citas, registros, tratamientos, comentarios, recepción y facturas. [Fuente del catálogo](https://doi.org/10.33093/jiwe.2023.3.2.5).
- **R20** · Current state of dental informatics in the field of health information systems: a scoping review. Revisa 44 estudios sobre codificación, captura y reutilización de datos odontológicos. [Fuente del catálogo](https://doi.org/10.1186/s12903-022-02163-9).
- **R21** · Electronic Health Records in Dentistry: Relevance, Challenges and Policy Directions. Analiza evolución, desafíos y políticas de historias clínicas electrónicas en odontología. [Fuente del catálogo](https://doi.org/10.1016/j.identj.2025.103964).
- **R23** · Barriers and facilitators for the implementation of electronic dental record systems: Perspectives from a developing country. Encuesta a odontólogos sobre barreras financieras, organizativas, técnicas, individuales, éticas y legales. [Fuente del catálogo](https://doi.org/10.1016/j.ijmedinf.2024.105622).
- **R31** · Reglamento de la Ley N.º 29733, Decreto Supremo N.º 016-2024-JUS. Normativa peruana aplicable según funciones y responsabilidades reales de tratamiento de datos. [Fuente del catálogo](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
