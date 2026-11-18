# Casos de prueba · APO-01

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-028

**MIC-BOLT-028 · PR-028 · Autenticar y cerrar sesión**. `Plan_Pruebas!33`.

Caso nominal con datos sintéticos: Validar identidad > establecer sesión > revocar cierre. Caso negativo: contraseña incorrecta, sesión caducada o privilegio insuficiente. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Autenticación/sesión/rol efectivos, con negación de accesos indebidos.

**Automatización** · Tests de autenticación, caducidad y autorización

**Hallazgo de inspección** · Login, logout, revocación y transporte de sesión en U y QA; comprobar expiración y cookie/CSRF.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/cookie-transport.test.js](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/cookie-transport.test.js), [frontend/web/tests/academic-a-session.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/academic-a-session.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-029

**MIC-BOLT-029 · PR-029 · Asignar roles y permisos mínimos**. `Plan_Pruebas!34`.

Caso nominal con datos sintéticos: Identificar rol > validar autorización > guardar > auditar. Caso negativo: contraseña incorrecta, sesión caducada o privilegio insuficiente. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Autenticación/sesión/rol efectivos, con negación de accesos indebidos.

**Automatización** · Tests de autenticación, caducidad y autorización

**Hallazgo de inspección** · Administración de usuarios y guards de rol; política QA de superadmin y configuración local. Evaluación completa de roles pendiente.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-b-users.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-b-users.test.cjs). **Ejecución específica** · NO VERIFICADO.

## TC-030

**MIC-BOLT-030 · PR-030 · Consultar auditoría de operaciones sensibles**. `Plan_Pruebas!35`.

Caso nominal con datos sintéticos: Autenticar auditor > filtrar registro > revisar eventos. Caso negativo: contraseña incorrecta, sesión caducada o privilegio insuficiente. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Autenticación/sesión/rol efectivos, con negación de accesos indebidos.

**Automatización** · Tests de autenticación, caducidad y autorización

**Hallazgo de inspección** · Existe consulta administrativa de auditoría financiera. Una vista global de toda operación sensible queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
