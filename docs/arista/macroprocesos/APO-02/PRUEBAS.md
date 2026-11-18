# Casos de prueba · APO-02

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-031

**MIC-BOLT-031 · PR-031 · Consultar stock mínimo (simulación)**. `Plan_Pruebas!36`.

Caso nominal con datos sintéticos: Listar insumos ficticios > comparar umbral > alertar. Caso negativo: stock negativo, umbral límite o movimiento repetido ficticio. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Resultados correctos solo sobre inventario sintético y claramente identificado.

**Automatización** · Tests unitarios de umbrales y datos de ejemplo

**Hallazgo de inspección** · Consulta de stock mínimo propuesta. Ruta, pantalla, tabla y prueba propia quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-032

**MIC-BOLT-032 · PR-032 · Simular solicitud de reposición de insumos**. `Plan_Pruebas!37`.

Caso nominal con datos sintéticos: Detectar mínimo > proponer reposición > registrar estado. Caso negativo: stock negativo, umbral límite o movimiento repetido ficticio. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Resultados correctos solo sobre inventario sintético y claramente identificado.

**Automatización** · Tests unitarios de umbrales y datos de ejemplo

**Hallazgo de inspección** · Solicitud de reposición simulada propuesta. Código y prueba propia quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-033

**MIC-BOLT-033 · PR-033 · Registrar entrada/salida de insumos ficticios**. `Plan_Pruebas!38`.

Caso nominal con datos sintéticos: Validar movimiento > recalcular stock > mostrar resultado. Caso negativo: stock negativo, umbral límite o movimiento repetido ficticio. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Resultados correctos solo sobre inventario sintético y claramente identificado.

**Automatización** · Tests unitarios de umbrales y datos de ejemplo

**Hallazgo de inspección** · Movimientos ficticios propuestos. Código, persistencia e invariantes de saldo quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
