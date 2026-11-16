# OPE-03 · Atención clínica e historias odontológicas

Historia, odontograma y anexos.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!11`. Estado de la matriz «Existente reportado».

## Alcance observado

Historia, odontograma y adjuntos protegidos tienen implementaciones. Hay rutas de adendas, y QA amplía las revisiones clínicas, la auditoría de lectura y las validaciones de carga.

Acreditar acceso por permiso, persistencia de la anotación original, rollback y trazabilidad de rectificación. Alcance de aceptación pendiente.

Estado consignado en la matriz «Existente reportado».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Frontend | [frontend/web/src/components/ClinicalImage.jsx](../../../../frontend/web/src/components/ClinicalImage.jsx) | MIC-BOLT-018 |
| Frontend | [frontend/web/src/components/OdontogramaEditor.jsx](../../../../frontend/web/src/components/OdontogramaEditor.jsx) | MIC-BOLT-017 |
| Frontend | [frontend/web/src/pages/Historias.jsx](../../../../frontend/web/src/pages/Historias.jsx) | MIC-BOLT-016, MIC-BOLT-017, MIC-BOLT-018, MIC-BOLT-019 |
| Frontend | [frontend/web/src/pages/PacienteDetalle.jsx](../../../../frontend/web/src/pages/PacienteDetalle.jsx) | MIC-BOLT-016, MIC-BOLT-019 |
| Backend | [backend/api/src/controllers/historias.controller.js](../../../../backend/api/src/controllers/historias.controller.js) | MIC-BOLT-016, MIC-BOLT-017, MIC-BOLT-018, MIC-BOLT-019 |
| Backend | [backend/api/src/services/clinicalFiles.js](../../../../backend/api/src/services/clinicalFiles.js) | MIC-BOLT-018 |
| Backend | [backend/api/src/services/clinicalUpload.js](../../../../backend/api/src/services/clinicalUpload.js) | MIC-BOLT-018 |
| Rutas API | [backend/api/src/routes/historias.routes.js](../../../../backend/api/src/routes/historias.routes.js) | MIC-BOLT-016, MIC-BOLT-017, MIC-BOLT-018, MIC-BOLT-019 |
| Base de datos | [database/init.sql](../../../../database/init.sql) | MIC-BOLT-016, MIC-BOLT-017, MIC-BOLT-018, MIC-BOLT-019 |
| Pruebas | [backend/api/tests/unit/academic-a-history.test.cjs](../../../../backend/api/tests/unit/academic-a-history.test.cjs) | MIC-BOLT-016 |
| Pruebas | [backend/api/tests/unit/academic-c-attachments.test.cjs](../../../../backend/api/tests/unit/academic-c-attachments.test.cjs) | MIC-BOLT-018 |
| Pruebas | [frontend/web/tests/coverage-p2-clinical.test.mjs](../../../../frontend/web/tests/coverage-p2-clinical.test.mjs) | MIC-BOLT-017 |

Filas clínicas históricas en el inventario local · 23. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

Referencias universitarias de contexto fuera del conjunto mínimo

- `backend/api/tests/clinical-files-integration.cjs` · Pruebas

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-06` · `AP-04`, `AP-07`, `AP-08`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-016](PRUEBAS.md#tc-016) | PR-016 · Crear o actualizar historia clínica | TC-016 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-017](PRUEBAS.md#tc-017) | PR-017 · Registrar procedimiento en odontograma | TC-017 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-018](PRUEBAS.md#tc-018) | PR-018 · Adjuntar y consultar archivo clínico | TC-018 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-019](PRUEBAS.md#tc-019) | PR-019 · Rectificar anotación clínica con auditoría | TC-019 | Parcial | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-06 | Historia y adjuntos clínicos | Integridad, auditoría y control de acceso | R20, R21, R22, R28, R32 |

- **R20** · Current state of dental informatics in the field of health information systems: a scoping review. Revisa 44 estudios sobre codificación, captura y reutilización de datos odontológicos. [Fuente del catálogo](https://doi.org/10.1186/s12903-022-02163-9).
- **R21** · Electronic Health Records in Dentistry: Relevance, Challenges and Policy Directions. Analiza evolución, desafíos y políticas de historias clínicas electrónicas en odontología. [Fuente del catálogo](https://doi.org/10.1016/j.identj.2025.103964).
- **R22** · A usability evaluation of four commercial dental computer-based patient record systems. Estudio de usabilidad con tareas de documentación clínica en cuatro sistemas dentales. [Fuente del catálogo](https://doi.org/10.14219/jada.archive.2008.0105).
- **R28** · HL7 EHR System Functional Model, TI.8: Database Backup and Recovery. Exige considerar datos, estructura y elementos suficientes para recuperación consistente del EHR. [Fuente del catálogo](https://hl7.org/ehrs/uv/ehrsfmr2/en/Requirements-EHRSFMR2-TI.8.html).
- **R32** · NTS N.º 139-MINSA/2018/DGAIN: Norma Técnica de Salud para la Gestión de la Historia Clínica. Referencia peruana de manejo de historia clínica, sujeta a actualización y alcance aplicable. [Fuente del catálogo](https://www.gob.pe/institucion/minsa/normas-legales/187487-214-2018-).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
