# Casos de prueba · APO-05

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-041

**MIC-BOLT-041 · PR-041 · Ejecutar pruebas unitarias y regresión**. `Plan_Pruebas!46`.

Caso nominal con datos sintéticos: Definir caso > ejecutar en entorno aislado > almacenar evidencia. Caso negativo: test fallido, hallazgo no reproducido o evidencia asociada a versión errónea. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Reporte verificable, fecha, versión y alcance; sin aprobación por autodiagnóstico.

**Automatización** · CI, escaneo estático, verificación humana y reporte versionado

**Hallazgo de inspección** · Suites unitarias, integración y Cypress presentes. Informes anteriores tienen su propio alcance; ejecución del TC-041 en Fase 1 queda NO VERIFICADO.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/sonar-post-delta.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/sonar-post-delta.test.cjs), [frontend/web/cypress/e2e/micodent.cy.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/cypress/e2e/micodent.cy.cjs), [frontend/web/tests/sonar-post-delta.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/sonar-post-delta.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-042

**MIC-BOLT-042 · PR-042 · Auditar código y dependencias con IA**. `Plan_Pruebas!47`.

Caso nominal con datos sintéticos: E01–E17 > escanear > confirmar > corregir > reanalizar. Caso negativo: test fallido, hallazgo no reproducido o evidencia asociada a versión errónea. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Reporte verificable, fecha, versión y alcance; sin aprobación por autodiagnóstico.

**Automatización** · CI, escaneo estático, verificación humana y reporte versionado

**Hallazgo de inspección** · Scripts y reportes de Sonar/dependencias disponibles. Auditoría con IA, revisión independiente y gate final por versión quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/sonar-post-delta.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/sonar-post-delta.test.cjs), [frontend/web/tests/sonar-post-delta.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/sonar-post-delta.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-043

**MIC-BOLT-043 · PR-043 · Documentar versión y soporte**. `Plan_Pruebas!48`.

Caso nominal con datos sintéticos: Actualizar manual > checkpoint > manifiesto > handoff. Caso negativo: test fallido, hallazgo no reproducido o evidencia asociada a versión errónea. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Reporte verificable, fecha, versión y alcance; sin aprobación por autodiagnóstico.

**Automatización** · CI, escaneo estático, verificación humana y reporte versionado

**Hallazgo de inspección** · Readiness, checkpoints y planes de QA disponibles. Aceptación de soporte y decisión GO por entorno quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
