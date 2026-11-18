# Casos de prueba · OPE-04

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-020

**MIC-BOLT-020 · PR-020 · Registrar plan y evolución de tratamiento**. `Plan_Pruebas!25`.

Caso nominal con datos sintéticos: Evaluar > planificar > actualizar estado > guardar. Caso negativo: transición no permitida o evolución sin referencia. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La evolución mantiene integridad y transiciones de estado válidas.

**Automatización** · Tests de transición e integración de historial

**Hallazgo de inspección** · La consulta y la evolución tienen código. Plan longitudinal completo y seguimiento formal quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-021

**MIC-BOLT-021 · PR-021 · Emitir receta u orden radiográfica**. `Plan_Pruebas!26`.

Caso nominal con datos sintéticos: Seleccionar atención > validar > generar documento. Caso negativo: transición no permitida o evolución sin referencia. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La evolución mantiene integridad y transiciones de estado válidas.

**Automatización** · Tests de transición e integración de historial

**Hallazgo de inspección** · Recetas y órdenes radiográficas con emisión y reemisión; QA amplía firmas. Verificar integridad del documento original.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-c-documents.test.cjs](../../../../backend/api/tests/unit/academic-c-documents.test.cjs), [frontend/web/tests/academic-a-documents.test.mjs](../../../../frontend/web/tests/academic-a-documents.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-022

**MIC-BOLT-022 · PR-022 · Registrar trabajo de laboratorio odontológico**. `Plan_Pruebas!27`.

Caso nominal con datos sintéticos: Crear orden > registrar avance > entregar/cerrar. Caso negativo: transición no permitida o evolución sin referencia. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La evolución mantiene integridad y transiciones de estado válidas.

**Automatización** · Tests de transición e integración de historial

**Hallazgo de inspección** · Alta y consulta de trabajos por consulta y registro de pagos en /api/laboratorio; comprobar vínculo a la consulta y totales.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-laboratory.test.cjs](../../../../backend/api/tests/unit/academic-b-laboratory.test.cjs). **Ejecución específica** · NO VERIFICADO.
