# Casos de prueba · OPE-06

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-026

**MIC-BOLT-026 · PR-026 · Generar reporte de actividad clínica**. `Plan_Pruebas!31`.

Caso nominal con datos sintéticos: Elegir rango y filtros > consultar > generar resultado. Caso negativo: filtro inválido, indicador sin datos o reporte sin autorización. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los KPI coinciden con datos de origen y respetan permisos.

**Automatización** · Tests SQL/API de filtros, datos y permisos

**Hallazgo de inspección** · Vista de producción y API de actividad; emisión/exportación de reporte formal queda NO VERIFICADO.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-summary.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-b-summary.test.cjs). **Ejecución específica** · NO VERIFICADO.

## TC-027

**MIC-BOLT-027 · PR-027 · Consultar indicadores operativos y financieros**. `Plan_Pruebas!32`.

Caso nominal con datos sintéticos: Autorizar > agregar indicadores > visualizar. Caso negativo: filtro inválido, indicador sin datos o reporte sin autorización. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los KPI coinciden con datos de origen y respetan permisos.

**Automatización** · Tests SQL/API de filtros, datos y permisos

**Hallazgo de inspección** · Estadísticas, citas y resumen financiero con filtro de rol; verificar rangos y reconciliar totales con SQL sintético.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-summary.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-b-summary.test.cjs), [frontend/web/tests/coverage-p2-finance.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/coverage-p2-finance.test.mjs). **Ejecución específica** · NO VERIFICADO.
