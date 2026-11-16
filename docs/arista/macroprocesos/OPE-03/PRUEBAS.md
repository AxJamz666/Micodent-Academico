# Casos de prueba · OPE-03

Estado de ejecución del caso del catálogo NO EJECUTADO. Los ensayos del candidato se registran por suite y su versión en el control local.

## TC-016

**MIC-BOLT-016 · PR-016 · Crear o actualizar historia clínica**. `Plan_Pruebas!21`.

Caso nominal con datos sintéticos: Validar paciente y permiso > registrar encuentro > guardar. Caso negativo: usuario sin permiso, anotación inconsistente o adjunto inválido. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La información queda íntegra, accesible solo por roles aprobados y auditable.

**Automatización** · Tests negativos RBAC y persistencia de datos

**Hallazgo de inspección** · Consulta por paciente, consultas y antecedentes en el agregado clínico. El alta de historia se vincula al paciente; revisar cada variante de edición.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-history.test.cjs](../../../../backend/api/tests/unit/academic-a-history.test.cjs). **Ejecución específica** · NO VERIFICADO.

## TC-017

**MIC-BOLT-017 · PR-017 · Registrar procedimiento en odontograma**. `Plan_Pruebas!22`.

Caso nominal con datos sintéticos: Seleccionar pieza > registrar hallazgo > conservar trazabilidad. Caso negativo: usuario sin permiso, anotación inconsistente o adjunto inválido. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La información queda íntegra, accesible solo por roles aprobados y auditable.

**Automatización** · Tests negativos RBAC y persistencia de datos

**Hallazgo de inspección** · Alta de ítem de odontograma, editor y SQL. QA incorpora anulaciones específicas; verificar trazabilidad y permisos.

**Pruebas existentes relacionadas** · [frontend/web/tests/coverage-p2-clinical.test.mjs](../../../../frontend/web/tests/coverage-p2-clinical.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-018

**MIC-BOLT-018 · PR-018 · Adjuntar y consultar archivo clínico**. `Plan_Pruebas!23`.

Caso nominal con datos sintéticos: Validar tipo/tamaño > autorizar > almacenar > consultar. Caso negativo: usuario sin permiso, anotación inconsistente o adjunto inválido. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La información queda íntegra, accesible solo por roles aprobados y auditable.

**Automatización** · Tests negativos RBAC y persistencia de datos

**Hallazgo de inspección** · Carga y lectura autenticada de radiografías/adjuntos y eliminación/restauración; QA añade auditoría de lectura.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-c-attachments.test.cjs](../../../../backend/api/tests/unit/academic-c-attachments.test.cjs). **Ejecución específica** · NO VERIFICADO.

## TC-019

**MIC-BOLT-019 · PR-019 · Rectificar anotación clínica con auditoría**. `Plan_Pruebas!24`.

Caso nominal con datos sintéticos: Solicitar corrección > registrar motivo > conservar original. Caso negativo: usuario sin permiso, anotación inconsistente o adjunto inválido. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La información queda íntegra, accesible solo por roles aprobados y auditable.

**Automatización** · Tests negativos RBAC y persistencia de datos

**Hallazgo de inspección** · Rutas de adendas de consulta y odontograma en U y QA. QA agrega revisiones de antecedentes, y preservación/aceptación de todos los casos queda abierta.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
