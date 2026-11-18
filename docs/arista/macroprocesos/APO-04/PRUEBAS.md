# Casos de prueba · APO-04

Estado de ejecución del caso del catálogo NO EJECUTADO. Los ensayos del candidato se registran por suite y su versión en el control local.

## TC-037

**MIC-BOLT-037 · PR-037 · Iniciar DEMO aislada**. `Plan_Pruebas!42`.

Caso nominal con datos sintéticos: Seleccionar DEMO > validar configuración > iniciar entorno. Caso negativo: modo incorrecto, servicio sin permisos, firma inválida o LAN no autorizada. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Arranque/actualización seguros por modalidad y entorno; errores bloquean liberación.

**Automatización** · Matriz LOCAL/DEMO/LAN y pruebas de instalación limpia

**Hallazgo de inspección** · Launcher y runner QA implementan modos. Presencia de código DEMO verificada, aceptación por versión pendiente.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-038

**MIC-BOLT-038 · PR-038 · Iniciar PRINCIPAL local/LAN**. `Plan_Pruebas!43`.

Caso nominal con datos sintéticos: Seleccionar modo > comprobar red > validar identidad > iniciar. Caso negativo: modo incorrecto, servicio sin permisos, firma inválida o LAN no autorizada. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Arranque/actualización seguros por modalidad y entorno; errores bloquean liberación.

**Automatización** · Matriz LOCAL/DEMO/LAN y pruebas de instalación limpia

**Hallazgo de inspección** · QA y la capa 0.4.4 aportan runtime, LAN y manejo de identidad de sitio. Operación física del binario y entorno objetivo queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-039

**MIC-BOLT-039 · PR-039 · Preparar actualización PRINCIPAL/SQL**. `Plan_Pruebas!44`.

Caso nominal con datos sintéticos: Validar firma > revisar versión > migraciones > emitir plan. Caso negativo: modo incorrecto, servicio sin permisos, firma inválida o LAN no autorizada. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Arranque/actualización seguros por modalidad y entorno; errores bloquean liberación.

**Automatización** · Matriz LOCAL/DEMO/LAN y pruebas de instalación limpia

**Hallazgo de inspección** · Preparación de actualización/SQL y pruebas dirigidas en QA; ejecución real del candidato queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-040

**MIC-BOLT-040 · PR-040 · Preparar/autorizar ejecución helper Windows**. `Plan_Pruebas!45`.

Caso nominal con datos sintéticos: Preparar plan > obtener aceptación > ejecutar en simulación. Caso negativo: modo incorrecto, servicio sin permisos, firma inválida o LAN no autorizada. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Arranque/actualización seguros por modalidad y entorno; errores bloquean liberación.

**Automatización** · Matriz LOCAL/DEMO/LAN y pruebas de instalación limpia

**Hallazgo de inspección** · Hay helper/instalador y pruebas de contrato SCM. Autorización y ejecución en la instalación física terminan en gate separado.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
