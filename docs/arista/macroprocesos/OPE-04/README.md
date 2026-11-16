# OPE-04 · Tratamientos y seguimiento clínico

Plan de tratamiento, receta, órdenes y laboratorio.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!12`. Estado de la matriz «Existente reportado».

## Alcance observado

Consultas/evolución, emisión/reemisión e integración de laboratorio tienen código. QA añade persistencia de firmas clínicas. Cobros y OPE-03 comparten el agregado de historia.

Verificar correlación longitudinal del plan, estados de laboratorio y alcance de reemisión. Seguimiento automatizado externo sin evidencia.

Estado consignado en la matriz «Existente reportado».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Frontend | [frontend/web/src/components/DocumentActions.jsx](../../../../frontend/web/src/components/DocumentActions.jsx) | MIC-BOLT-021 |
| Frontend | [frontend/web/src/components/OrdenRadiografiaTab.jsx](../../../../frontend/web/src/components/OrdenRadiografiaTab.jsx) | MIC-BOLT-021 |
| Frontend | [frontend/web/src/components/RecetarioTab.jsx](../../../../frontend/web/src/components/RecetarioTab.jsx) | MIC-BOLT-021 |
| Frontend | [frontend/web/src/pages/PacienteDetalle.jsx](../../../../frontend/web/src/pages/PacienteDetalle.jsx) | MIC-BOLT-020, MIC-BOLT-022 |
| Backend | [backend/api/src/controllers/historias.controller.js](../../../../backend/api/src/controllers/historias.controller.js) | MIC-BOLT-020, MIC-BOLT-021 |
| Backend | [backend/api/src/controllers/laboratorio.controller.js](../../../../backend/api/src/controllers/laboratorio.controller.js) | MIC-BOLT-022 |
| Rutas API | [backend/api/src/routes/historias.routes.js](../../../../backend/api/src/routes/historias.routes.js) | MIC-BOLT-020, MIC-BOLT-021 |
| Rutas API | [backend/api/src/routes/laboratorio.routes.js](../../../../backend/api/src/routes/laboratorio.routes.js) | MIC-BOLT-022 |
| Base de datos | [database/init.sql](../../../../database/init.sql) | MIC-BOLT-020, MIC-BOLT-021, MIC-BOLT-022 |
| Pruebas | [backend/api/tests/unit/academic-b-laboratory.test.cjs](../../../../backend/api/tests/unit/academic-b-laboratory.test.cjs) | MIC-BOLT-022 |
| Pruebas | [backend/api/tests/unit/academic-c-documents.test.cjs](../../../../backend/api/tests/unit/academic-c-documents.test.cjs) | MIC-BOLT-021 |
| Pruebas | [frontend/web/tests/academic-a-documents.test.mjs](../../../../frontend/web/tests/academic-a-documents.test.mjs) | MIC-BOLT-021 |

Filas clínicas históricas en el inventario local · 21. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-07` · `AP-05`, `AP-07`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-020](PRUEBAS.md#tc-020) | PR-020 · Registrar plan y evolución de tratamiento | TC-020 | Parcial | NO VERIFICADO |
| [MIC-BOLT-021](PRUEBAS.md#tc-021) | PR-021 · Emitir receta u orden radiográfica | TC-021 | Código identificado | NO VERIFICADO |
| [MIC-BOLT-022](PRUEBAS.md#tc-022) | PR-022 · Registrar trabajo de laboratorio odontológico | TC-022 | Código identificado | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-07 | Seguimiento de atención | Registro consistente de evolución | R04, R19, R21 |

- **R04** · Implementation of Extreme Programming (XP) in the Development of Dental Clinic Information Systems. Desarrolla sistema dental web con historias, citas, existencias de medicamentos, facturas y pruebas black-box. [Fuente del catálogo](https://doi.org/10.47794/jesica.v2i1.22).
- **R19** · Streamlining Dental Clinic Management for Effective Digitisation Productivity and Usability. Desarrolla sistema con citas, registros, tratamientos, comentarios, recepción y facturas. [Fuente del catálogo](https://doi.org/10.33093/jiwe.2023.3.2.5).
- **R21** · Electronic Health Records in Dentistry: Relevance, Challenges and Policy Directions. Analiza evolución, desafíos y políticas de historias clínicas electrónicas en odontología. [Fuente del catálogo](https://doi.org/10.1016/j.identj.2025.103964).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
