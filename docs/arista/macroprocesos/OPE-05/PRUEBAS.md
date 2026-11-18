# Casos de prueba · OPE-05

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-023

**MIC-BOLT-023 · PR-023 · Registrar cobro**. `Plan_Pruebas!28`.

Caso nominal con datos sintéticos: Seleccionar concepto > validar monto > registrar transacción. Caso negativo: monto negativo, operación duplicada o fallo en mitad de una transacción. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los saldos y transacciones permanecen consistentes o se revierten íntegramente.

**Automatización** · Tests transaccionales y rollback deliberado

**Hallazgo de inspección** · Registro/anulación de abono y servicios transaccionales; verificar idempotencia, saldo y reversión.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-c-payments.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-c-payments.test.cjs). **Ejecución específica** · NO VERIFICADO.

## TC-024

**MIC-BOLT-024 · PR-024 · Registrar gasto y control financiero**. `Plan_Pruebas!29`.

Caso nominal con datos sintéticos: Validar concepto/fecha > registrar > consolidar. Caso negativo: monto negativo, operación duplicada o fallo en mitad de una transacción. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los saldos y transacciones permanecen consistentes o se revierten íntegramente.

**Automatización** · Tests transaccionales y rollback deliberado

**Hallazgo de inspección** · Rutas de gastos, edición y reactivación con acceso administrativo; verificar trazas y totales.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-expenses.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-b-expenses.test.cjs), [frontend/web/tests/academic-b-finance.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/academic-b-finance.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-025

**MIC-BOLT-025 · PR-025 · Consultar caja y conciliación**. `Plan_Pruebas!30`.

Caso nominal con datos sintéticos: Seleccionar periodo > sumar movimientos > comprobar integridad. Caso negativo: monto negativo, operación duplicada o fallo en mitad de una transacción. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los saldos y transacciones permanecen consistentes o se revierten íntegramente.

**Automatización** · Tests transaccionales y rollback deliberado

**Hallazgo de inspección** · Resumen financiero y conciliación de costos históricos tienen código; conciliación bancaria o emisión fiscal quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · [frontend/web/tests/academic-b-finance.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/academic-b-finance.test.mjs). **Ejecución específica** · NO VERIFICADO.
