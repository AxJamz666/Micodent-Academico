# EST-01 · Dirección y mejora del servicio clínico

Asegura objetivos, indicadores y mejora continua.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!6`. Estado de la matriz «Propuesta organizativa».

## Alcance observado

Documentación de requisitos técnicos y tablero operativo reutilizable. Los indicadores del tablero sirven como insumo de revisión.

Objetivos clínicos, línea base, responsables y aprobación del interesado sin evidencia verificable. El tablero no acredita gestión de mejora.

Estado consignado en la matriz «Propuesta organizativa».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Frontend | [frontend/web/src/pages/Dashboard.jsx](../../../../frontend/web/src/pages/Dashboard.jsx) | MIC-BOLT-002 |
| Backend | [backend/api/src/controllers/dashboard.controller.js](../../../../backend/api/src/controllers/dashboard.controller.js) | MIC-BOLT-002 |
| Rutas API | [backend/api/src/routes/dashboard.routes.js](../../../../backend/api/src/routes/dashboard.routes.js) | MIC-BOLT-002 |
| Base de datos | [database/init.sql](../../../../database/init.sql) | MIC-BOLT-002 |
| Pruebas | [backend/api/tests/unit/academic-b-summary.test.cjs](../../../../backend/api/tests/unit/academic-b-summary.test.cjs) | MIC-BOLT-002 |

Filas clínicas históricas en el inventario local · 11. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

Referencias universitarias de contexto fuera del conjunto mínimo

- `docs/university/UNIVERSITY_ADAPTATION_PLAN.md` · Documentación/evidencia
- `docs/university/UNIVERSITY_REQUIREMENTS.md` · Documentación/evidencia

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-01` · `AP-01`, `AP-13`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-001](PRUEBAS.md#tc-001) | PR-001 · Definir objetivos de atención y calidad | TC-001 | Documental | NO VERIFICADO |
| [MIC-BOLT-002](PRUEBAS.md#tc-002) | PR-002 · Revisar indicadores y necesidades de mejora | TC-002 | Parcial | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-01 | Medir mejora y recoger retroalimentación | Requisitos revisables e indicadores auditables | R01, R02, R23 |

- **R01** · A Design Science Research Methodology for Information Systems Research. Proceso de investigación de diseño con identificación, diseño, demostración, evaluación y comunicación. [Fuente del catálogo](https://doi.org/10.2753/MIS0742-1222240302).
- **R02** · User feedback in continuous software engineering: revealing the state-of-practice. Investiga prácticas reales para recopilar y utilizar retroalimentación continua de usuarios. [Fuente del catálogo](https://doi.org/10.1007/s10664-024-10557-2).
- **R23** · Barriers and facilitators for the implementation of electronic dental record systems: Perspectives from a developing country. Encuesta a odontólogos sobre barreras financieras, organizativas, técnicas, individuales, éticas y legales. [Fuente del catálogo](https://doi.org/10.1016/j.ijmedinf.2024.105622).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
