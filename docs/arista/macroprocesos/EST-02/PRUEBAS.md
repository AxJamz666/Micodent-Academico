# Casos de prueba · EST-02

Estado de ejecución del caso del catálogo NO EJECUTADO. Los ensayos del candidato se registran por suite y su versión en el control local.

## TC-003

**MIC-BOLT-003 · PR-003 · Registrar requisito y aprobación del interesado**. `Plan_Pruebas!8`.

Caso nominal con datos sintéticos: Solicitar cambio > analizar alcance > aprobar/rechazar > registrar. Caso negativo: requisito sin trazabilidad/aceptación o diff sin revisión. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Cambios trazados y decisión humana explícita; bloqueos visibles.

**Automatización** · Revisión Git + checklist de aceptación y ADR

**Hallazgo de inspección** · Requisitos y límites de edición existen en la documentación; la aprobación del interesado queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-004

**MIC-BOLT-004 · PR-004 · Gestionar incremento de software con IA**. `Plan_Pruebas!9`.

Caso nominal con datos sintéticos: Especificar ARISTA-P > codiseñar > construir > verificar > aceptar. Caso negativo: requisito sin trazabilidad/aceptación o diff sin revisión. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Cambios trazados y decisión humana explícita; bloqueos visibles.

**Automatización** · Revisión Git + checklist de aceptación y ADR

**Hallazgo de inspección** · Existen planes y checkpoints de ingeniería. Uso histórico de un prompt ARISTA-IA 1.1 queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.

## TC-005

**MIC-BOLT-005 · PR-005 · Evaluar y aprobar versión candidata**. `Plan_Pruebas!10`.

Caso nominal con datos sintéticos: Consolidar cambios > revisar riesgos > verificar gates > decidir. Caso negativo: requisito sin trazabilidad/aceptación o diff sin revisión. Límite: valores extremos, recurso inexistente o transición inválida según reglas.

**Criterio** · Cambios trazados y decisión humana explícita; bloqueos visibles.

**Automatización** · Revisión Git + checklist de aceptación y ADR

**Hallazgo de inspección** · Historial de validación U3C, U4A estático y checkpoint clínico; evidencia de aprobación integral queda NO VERIFICADO.

**Pruebas existentes relacionadas** · NO VERIFICADO. **Ejecución específica** · NO VERIFICADO.
