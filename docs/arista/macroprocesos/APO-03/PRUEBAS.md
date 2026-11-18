# Casos de prueba · APO-03

Estado del catálogo conservado como plan. Consultar ../../RESULTADOS_JOSE.md y README.md para las nuevas ejecuciones de José. TC-025 y TC-031/032/033 cuentan con pruebas propias publicadas.

## TC-034

**MIC-BOLT-034 · PR-034 · Generar respaldo consistente**. `Plan_Pruebas!39`.

Caso nominal con datos sintéticos: Seleccionar conjunto > crear respaldo > registrar resultado. Caso negativo: archivo corrupto, contraseña errónea, destino parcial o restauración incompleta. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Restauración reproducible sin corrupción, sin exposición y con fallo parcial bloqueado.

**Automatización** · Ensayos de recuperación aislada y falla parcial

**Hallazgo de inspección** · QA cuenta con bundles y scripts de copia. Universidad aporta esquema/semillas y política de almacenamiento; backup coordinado PostgreSQL con adjuntos queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-035

**MIC-BOLT-035 · PR-035 · Restaurar respaldo aislado**. `Plan_Pruebas!40`.

Caso nominal con datos sintéticos: Validar copia > comprobar destino > restaurar > verificar. Caso negativo: archivo corrupto, contraseña errónea, destino parcial o restauración incompleta. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Restauración reproducible sin corrupción, sin exposición y con fallo parcial bloqueado.

**Automatización** · Ensayos de recuperación aislada y falla parcial

**Hallazgo de inspección** · QA dispone de restauración y verificación aisladas. El checkpoint U3C aporta reconstrucción de esquema, sin verificar restauración integral PostgreSQL.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-036

**MIC-BOLT-036 · PR-036 · Gestionar retención tras verificación**. `Plan_Pruebas!41`.

Caso nominal con datos sintéticos: Comprobar restauración > evaluar retención > registrar evento. Caso negativo: archivo corrupto, contraseña errónea, destino parcial o restauración incompleta. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Restauración reproducible sin corrupción, sin exposición y con fallo parcial bloqueado.

**Automatización** · Ensayos de recuperación aislada y falla parcial

**Hallazgo de inspección** · QA comprueba retención por modo y protege el último respaldo verificado. Para clínica, la política queda pendiente; en PostgreSQL, código equivalente queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
