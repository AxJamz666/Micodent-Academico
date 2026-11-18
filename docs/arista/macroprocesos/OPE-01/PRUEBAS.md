# Casos de prueba · OPE-01

Estado de ejecución del caso del catálogo NO EJECUTADO. Los ensayos del candidato se registran por suite y su versión en el control local.

## TC-009

**MIC-BOLT-009 · PR-009 · Registrar paciente**. `Plan_Pruebas!14`.

Caso nominal con datos sintéticos: Validar datos > verificar duplicados > registrar > confirmar. Caso negativo: registro duplicado, campos inválidos o rol no autorizado. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · El dato válido se conserva sin duplicados; inválidos y accesos indebidos se rechazan.

**Automatización** · Tests API unitarios e integración con BD ficticia

**Hallazgo de inspección** · UI de nuevo paciente y POST /api/pacientes; verificar datos inválidos, duplicado concurrente y persistencia de auditoría.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-patients.test.cjs](../../../../backend/api/tests/unit/academic-a-patients.test.cjs), [backend/api/tests/unit/academic-b-patients.test.cjs](../../../../backend/api/tests/unit/academic-b-patients.test.cjs), [frontend/web/tests/academic-a-patient.test.mjs](../../../../frontend/web/tests/academic-a-patient.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-010

**MIC-BOLT-010 · PR-010 · Buscar y consultar ficha de paciente**. `Plan_Pruebas!15`.

Caso nominal con datos sintéticos: Autenticar > buscar > verificar permiso > mostrar. Caso negativo: registro duplicado, campos inválidos o rol no autorizado. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · El dato válido se conserva sin duplicados; inválidos y accesos indebidos se rechazan.

**Automatización** · Tests API unitarios e integración con BD ficticia

**Hallazgo de inspección** · GET /api/pacientes y GET /api/pacientes/:id más UI de búsqueda; verificar alcance y datos devueltos por rol.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-patients.test.cjs](../../../../backend/api/tests/unit/academic-a-patients.test.cjs), [backend/api/tests/unit/academic-b-patients.test.cjs](../../../../backend/api/tests/unit/academic-b-patients.test.cjs), [frontend/web/tests/academic-a-patient.test.mjs](../../../../frontend/web/tests/academic-a-patient.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-011

**MIC-BOLT-011 · PR-011 · Actualizar información de paciente**. `Plan_Pruebas!16`.

Caso nominal con datos sintéticos: Solicitar > validar cambios > guardar > registrar auditoría. Caso negativo: registro duplicado, campos inválidos o rol no autorizado. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · El dato válido se conserva sin duplicados; inválidos y accesos indebidos se rechazan.

**Automatización** · Tests API unitarios e integración con BD ficticia

**Hallazgo de inspección** · PUT /api/pacientes/:id, edición de ficha y auditoría por paciente; verificar ID inexistente y campos protegidos.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-patients.test.cjs](../../../../backend/api/tests/unit/academic-a-patients.test.cjs), [backend/api/tests/unit/academic-b-patients.test.cjs](../../../../backend/api/tests/unit/academic-b-patients.test.cjs), [frontend/web/tests/academic-a-patient.test.mjs](../../../../frontend/web/tests/academic-a-patient.test.mjs). **Ejecución específica** · NO VERIFICADO.
