# Casos de prueba · EST-01

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-001

**MIC-BOLT-001 · PR-001 · Definir objetivos de atención y calidad**. `Plan_Pruebas!6`.

Caso nominal con datos sintéticos: Identificar necesidades > priorizar objetivos > aprobar metas. Caso negativo: metas sin aprobación o indicador sin fuente; meta límite vacía. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Existe acuerdo y responsables documentados; no se aprueba lo incompleto.

**Automatización** · Checklist + acta aprobada con evidencia

**Hallazgo de inspección** · U y QA contienen planes técnicos y reportes; los objetivos de atención y sus aprobaciones quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-002

**MIC-BOLT-002 · PR-002 · Revisar indicadores y necesidades de mejora**. `Plan_Pruebas!7`.

Caso nominal con datos sintéticos: Consultar reporte > contrastar metas > acordar mejora. Caso negativo: metas sin aprobación o indicador sin fuente; meta límite vacía. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Existe acuerdo y responsables documentados; no se aprueba lo incompleto.

**Automatización** · Checklist + acta aprobada con evidencia

**Hallazgo de inspección** · Dashboard y API permiten leer indicadores; el ciclo formal de mejora y su aprobación quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-summary.test.cjs](../../../../backend/api/tests/unit/academic-b-summary.test.cjs). **Ejecución específica** · NO VERIFICADO.
