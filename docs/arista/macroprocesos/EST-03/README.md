# EST-03 · Gobernanza, privacidad y riesgos

Políticas de acceso, tratamiento de datos y aprobación.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!8`. Estado de la matriz «Controles en desarrollo».

## Alcance observado

Autorización, adjuntos protegidos y auditoría existen en código. En QA aparecen auditoría de lectura y preparación de registro append-only.

Faltan evidencias de aprobación de política de datos, simulacro de incidente y cierre integral de hallazgos por versión.

Estado consignado en la matriz «Controles en desarrollo».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Frontend | [frontend/web/src/components/SessionBoundary.jsx](../../../../frontend/web/src/components/SessionBoundary.jsx) | MIC-BOLT-006 |
| Backend | [backend/api/src/services/accessPolicy.js](../../../../backend/api/src/services/accessPolicy.js) | MIC-BOLT-006 |
| Backend | [backend/api/src/services/clinicalFiles.js](../../../../backend/api/src/services/clinicalFiles.js) | MIC-BOLT-006 |
| Backend | [backend/api/src/utils/auditoriaSeguridad.js](../../../../backend/api/src/utils/auditoriaSeguridad.js) | Compartido |
| Rutas API | [backend/api/src/routes/auditoria.routes.js](../../../../backend/api/src/routes/auditoria.routes.js) | Compartido |
| Base de datos | [database/init.sql](../../../../database/init.sql) | Compartido |
| Pruebas | [backend/api/tests/unit/access-policy.test.js](../../../../backend/api/tests/unit/access-policy.test.js) | Compartido |

Filas clínicas históricas en el inventario local · 12. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

Referencias universitarias de contexto fuera del conjunto mínimo

- `backend/api/tests/integration/security.test.js` · Pruebas
- `docs/university/SECURITY_PREFLIGHT.md` · Documentación/evidencia

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-03` · `AP-04`, `AP-08`, `AP-14`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-006](PRUEBAS.md#tc-006) | PR-006 · Gestionar clasificación y acceso a datos | TC-006 | Parcial | NO VERIFICADO |
| [MIC-BOLT-007](PRUEBAS.md#tc-007) | PR-007 · Atender hallazgo de seguridad | TC-007 | Documental | NO VERIFICADO |
| [MIC-BOLT-008](PRUEBAS.md#tc-008) | PR-008 · Gestionar incidente y acciones correctivas | TC-008 | NO VERIFICADO | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-03 | Privacidad, revisión y roles mínimos | Amenazas, autorización, revisión independiente | R12, R13, R15, R17, R31 |

- **R12** · Do Users Write More Insecure Code with AI Assistants?. Experimento donde participantes asistidos por IA entregaron soluciones menos seguras en determinadas tareas. [Fuente del catálogo](https://doi.org/10.1145/3576915.3623157).
- **R13** · InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents. Evalúa ataques de inyección indirecta contra agentes que utilizan herramientas. [Fuente del catálogo](https://doi.org/10.18653/v1/2024.findings-acl.624).
- **R15** · Secure Software Development Framework (SSDF), SP 800-218, v1.1. Prácticas de desarrollo seguro integrables en un SDLC, con respuesta a vulnerabilidades. [Fuente del catálogo](https://csrc.nist.gov/pubs/sp/800/218/final).
- **R17** · AI Risk Management Framework: Generative Artificial Intelligence Profile, NIST AI 600-1. Marco para incorporar riesgos de IA generativa en diseño, uso y evaluación. [Fuente del catálogo](https://doi.org/10.6028/NIST.AI.600-1).
- **R31** · Reglamento de la Ley N.º 29733, Decreto Supremo N.º 016-2024-JUS. Normativa peruana aplicable según funciones y responsabilidades reales de tratamiento de datos. [Fuente del catálogo](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus).
- **R32** · NTS N.º 139-MINSA/2018/DGAIN: Norma Técnica de Salud para la Gestión de la Historia Clínica. Referencia peruana de manejo de historia clínica, sujeta a actualización y alcance aplicable. [Fuente del catálogo](https://www.gob.pe/institucion/minsa/normas-legales/187487-214-2018-).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
