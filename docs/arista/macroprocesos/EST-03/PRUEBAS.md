# Casos de prueba · EST-03

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-006

**MIC-BOLT-006 · PR-006 · Gestionar clasificación y acceso a datos**. `Plan_Pruebas!11`.

Caso nominal con datos sintéticos: Clasificar > establecer política > autorizar > auditar. Caso negativo: intento de acceder a dato o acción sin permiso. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los accesos no autorizados se deniegan y las decisiones quedan registradas.

**Automatización** · Tests RBAC y revisión humana de amenazas

**Hallazgo de inspección** · Política de acceso y control de adjuntos en U y QA; clasificación completa y su aprobación quedan NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-007

**MIC-BOLT-007 · PR-007 · Atender hallazgo de seguridad**. `Plan_Pruebas!12`.

Caso nominal con datos sintéticos: Detectar > clasificar > corregir > retestar > aceptar/rechazar. Caso negativo: intento de acceder a dato o acción sin permiso. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los accesos no autorizados se deniegan y las decisiones quedan registradas.

**Automatización** · Tests RBAC y revisión humana de amenazas

**Hallazgo de inspección** · Preflight y diseño de seguridad documentados; cierre de hallazgos contra una versión candidata queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-008

**MIC-BOLT-008 · PR-008 · Gestionar incidente y acciones correctivas**. `Plan_Pruebas!13`.

Caso nominal con datos sintéticos: Detectar > contener > investigar > recuperar > documentar. Caso negativo: intento de acceder a dato o acción sin permiso. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Los accesos no autorizados se deniegan y las decisiones quedan registradas.

**Automatización** · Tests RBAC y revisión humana de amenazas

**Hallazgo de inspección** · El flujo formal de incidente, triage, acción correctiva y aprobación queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
