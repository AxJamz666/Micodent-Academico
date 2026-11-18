# Casos de prueba · OPE-02

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-012

**MIC-BOLT-012 · PR-012 · Programar cita y verificar disponibilidad**. `Plan_Pruebas!17`.

Caso nominal con datos sintéticos: Seleccionar profesional > evaluar conflicto > registrar. Caso negativo: reserva superpuesta, cambio de cita inexistente o filtro de fecha límite. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La agenda mantiene estados y evita conflictos; simulaciones se rotulan como tales.

**Automatización** · Tests API, colisiones y zonas horarias

**Hallazgo de inspección** · POST /api/citas y validaciones de disponibilidad/solapamiento en agenda; repetir el caso concurrente con PostgreSQL aislado.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-agenda.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-a-agenda.test.cjs), [frontend/web/tests/agendaUtils.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/agendaUtils.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-013

**MIC-BOLT-013 · PR-013 · Modificar o cancelar cita**. `Plan_Pruebas!18`.

Caso nominal con datos sintéticos: Localizar cita > verificar reglas > actualizar > notificar. Caso negativo: reserva superpuesta, cambio de cita inexistente o filtro de fecha límite. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La agenda mantiene estados y evita conflictos; simulaciones se rotulan como tales.

**Automatización** · Tests API, colisiones y zonas horarias

**Hallazgo de inspección** · PUT /api/citas/:id y PUT /api/citas/:id/estado respaldan la edición y el cambio de estado; verificar transiciones y permisos.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-agenda.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-a-agenda.test.cjs), [frontend/web/tests/agendaUtils.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/agendaUtils.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-014

**MIC-BOLT-014 · PR-014 · Consultar agenda por profesional y fecha**. `Plan_Pruebas!19`.

Caso nominal con datos sintéticos: Aplicar filtros > consultar API > mostrar estados. Caso negativo: reserva superpuesta, cambio de cita inexistente o filtro de fecha límite. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La agenda mantiene estados y evita conflictos; simulaciones se rotulan como tales.

**Automatización** · Tests API, colisiones y zonas horarias

**Hallazgo de inspección** · GET /api/citas y vistas día, semana, mes con selección de profesional; comprobar filtros y límites de fecha.

**Pruebas existentes relacionadas** · [backend/api/tests/unit/academic-a-agenda.test.cjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/backend/api/tests/unit/academic-a-agenda.test.cjs), [frontend/web/tests/agendaUtils.test.mjs](https://github.com/AxJamz666/Micodent-Academico/blob/b3239ed28f09c59f31ab00a0f210ed1a46bf1909/frontend/web/tests/agendaUtils.test.mjs). **Ejecución específica** · NO VERIFICADO.

## TC-015

**MIC-BOLT-015 · PR-015 · Confirmar cita odontológica (simulación)**. `Plan_Pruebas!20`.

Caso nominal con datos sintéticos: Elegir cita ficticia > confirmar/cancelar > mostrar resultado. Caso negativo: reserva superpuesta, cambio de cita inexistente o filtro de fecha límite. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · La agenda mantiene estados y evita conflictos; simulaciones se rotulan como tales.

**Automatización** · Tests API, colisiones y zonas horarias

**Hallazgo de inspección** · Existe cambio genérico de estado; la simulación académica de confirmación y su evidencia quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
