# APO-04 · Launcher, operación LAN y actualización

Inicio, DEMO, PRINCIPAL, servicio y actualización.

Auditor Alex · Revisión cruzada José. Fila de definición `Macroprocesos!18`. Estado de la matriz «Candidato de código; validación abierta».

## Alcance observado

Universidad tiene contratos de runtime/proxy. QA y capa 0.4.4 aportan launcher, supervisor, preparación de MariaDB, modos y servicio/actualización Windows.

Candidata de QA sin autorización de instalación o uso clínico. Prueba física LAN, instalador, ejecución real de actualización y helper SCM requieren evidencia y gates propios.

Estado consignado en la matriz «Candidato de código; validación abierta».

## Código y pruebas del candidato

| Capa | Ruta relativa en esta edición | Bolts relacionados |
| --- | --- | --- |
| Backend | [backend/api/src/config/browserTransport.js](../../../../backend/api/src/config/browserTransport.js) | MIC-BOLT-038 |
| Backend | [backend/api/src/config/runtime.js](../../../../backend/api/src/config/runtime.js) | Compartido |
| Pruebas | [backend/api/tests/unit/university-environment.test.cjs](../../../../backend/api/tests/unit/university-environment.test.cjs) | Compartido |

Filas clínicas históricas en el inventario local · 22. La copia académica contiene PostgreSQL y mantiene esas rutas como evidencia local de la Fase 1.

Referencias universitarias de contexto fuera del conjunto mínimo

- `docs/university/API_PROXY_AUDIT.md` · Documentación/evidencia
- `docs/university/U4A_STATIC_CONTAINER_VALIDATION.md` · Documentación/evidencia

## Requisitos, procedimientos y casos

Los identificadores de requisito/procedimiento siguen la matriz. La formalización del requisito de negocio y su aprobación se registrarán con [la evidencia de caso](PRUEBAS.md). Plantilla `AP-MP-13` · `AP-09`, `AP-10`, `AP-12`.

| Bolt | Procedimiento del catálogo | Caso | Estado inspección Fase 1, revisado en 2A | Resultado caso |
| --- | --- | --- | --- | --- |
| [MIC-BOLT-037](PRUEBAS.md#tc-037) | PR-037 · Iniciar DEMO aislada | TC-037 | Parcial | NO VERIFICADO |
| [MIC-BOLT-038](PRUEBAS.md#tc-038) | PR-038 · Iniciar PRINCIPAL local/LAN | TC-038 | Parcial | NO VERIFICADO |
| [MIC-BOLT-039](PRUEBAS.md#tc-039) | PR-039 · Preparar actualización PRINCIPAL/SQL | TC-039 | Parcial | NO VERIFICADO |
| [MIC-BOLT-040](PRUEBAS.md#tc-040) | PR-040 · Preparar/autorizar ejecución helper Windows | TC-040 | Parcial | NO VERIFICADO |

## Fuentes y decisiones

| Decisión | Aplicación | Verificación propuesta | Fuentes |
| --- | --- | --- | --- |
| DEC-13 | Separar DEMO y PRINCIPAL | Aislamiento de configuración y datos | R15, R29 |
| DEC-14 | Compatibilidad LOCAL/LAN | Matriz de entorno, red física y certificados | R15, R24 |
| DEC-15 | Instalador y actualización firmados | Integridad de paquete, permisos y rollback | R25, R26, R30 |
| DEC-16 | Migraciones de base de datos | Versiones compatibles, reversión, conservación | R28, R30 |

- **R15** · Secure Software Development Framework (SSDF), SP 800-218, v1.1. Prácticas de desarrollo seguro integrables en un SDLC, con respuesta a vulnerabilidades. [Fuente del catálogo](https://csrc.nist.gov/pubs/sp/800/218/final).
- **R24** · Design and Validation of an Offline-First Electronic Health Record Architecture for Intermittent Connectivity Environments. Prototipo EHR en servidor local con sincronización diferida y evaluación de desempeño. [Fuente del catálogo](https://doi.org/10.18687/LACCEI2026.1.1.2509).
- **R25** · Survivable Key Compromise in Software Update Systems. Presenta principios y TUF para distribuir actualizaciones resistentes a compromisos de claves. [Fuente del catálogo](https://doi.org/10.1145/1866307.1866315).
- **R26** · Security Considerations for Code Signing. Explica firma digital de código, validación de procedencia y mitigación de manipulación. [Fuente del catálogo](https://doi.org/10.6028/NIST.CSWP.5).
- **R29** · On the Removal of Feature Toggles. Analiza el ciclo de vida de banderas de funcionalidad y riesgos de dejarlas sin gestión. [Fuente del catálogo](https://doi.org/10.1007/s10664-020-09902-y).
- **R30** · Relational Database Schema Evolution: An Industrial Case Study. Analiza dificultades reales de evolución del esquema relacional y propagación a distintas instancias. [Fuente del catálogo](https://doi.org/10.1109/ICSME.2018.00073).

Los metadatos editoriales se conservan como referencia del catálogo. Revalidación bibliográfica antes de la entrega final.
