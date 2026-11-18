# Resultados de la auditoría y aportaciones de José

17 de noviembre de 2026, America/Lima.
Autor Jose Antonio Huaranga Salazar, joseHuaranga4198, jhuaranga4198@gmail.com.
Base académica b3239ed28f09c59f31ab00a0f210ed1a46bf1909.

## Aportaciones
- PR #1 https://github.com/AxJamz666/Micodent-Academico/pull/1
  Commit 6039b5e7c2f2636d444b2048d852caad7797f7f4.
  OPE-05 / MIC-BOLT-025 / TC-025. Prueba propia de conciliación e idempotencia.
- PR #2 https://github.com/AxJamz666/Micodent-Academico/pull/2
  Commits 8bfdd254d4263da652834c8149b2807ff90c08f5 y 6159d84e19ca89d10f69f3444f3fe27a1b8b013b.
  APO-02 / MIC-BOLT-031,032,033. Inventario PostgreSQL, interfaz y pruebas propias.

## Ejecuciones
Windows, Node v26.7.0, PostgreSQL 18.6. Datos ficticios en instancia local desechable.
- Desde backend/api, node --test --test-concurrency=1 tests/postgres/u3b-conciliacion.test.cjs: tres escenarios aprobados, cuatro tests incluyendo contenedor.
- Desde backend/api, npm test: 115 aprobadas, cero fallos.
- Rama de insumos, node --test --test-concurrency=1 tests/postgres/u3b-runtime.test.cjs tests/postgres/jose-insumos.test.cjs: 17 aprobadas. Incluye sesiones, restricciones por rol, agenda concurrente, pagos idempotentes, rollback, CRUD, salud y movimientos de stock.
- Desde la raíz, node --test frontend/web/tests/jose-insumos.test.mjs: una prueba aprobada de vista y reintento con misma clave tras pérdida de respuesta.
- Desde frontend/web, npm run build: aprobado, aviso de chunk mayor de 500 kB.
- Desde frontend/web, npm test: 151 casos, 144 aprobados, 7 fallidos. La suite global requiere resolución de los hallazgos; las cifras no se sustituyen por resultados históricos.
- node --test tests/unit/postgres-u3b2.test.cjs: 4 aprobadas después del ajuste de salud para inventario.
- npm ci --ignore-scripts: backend 9 vulnerabilidades (4 moderadas y 5 altas); frontend 18 (6 moderadas y 12 altas). No se realizaron actualizaciones masivas.

## Incidencias de laboratorio
El primer ensayo conjunto reportó 37 tablas frente a 35 y salud 503. Se adaptó el verificador para reconocer explícitamente las dos tablas del inventario y comprobar sus columnas.
El laboratorio inicial con locale C no normalizaba la búsqueda de JOSÉ. Se recreó únicamente la base desechable con ICU es-PE, tras lo cual pasó el CRUD y la suite conjunta 17/17.
Las credenciales se generan aleatoriamente y permanecen fuera de Git.

## Estado de los 21 Bolts
TRAZABILIDAD_21_BOLTS_JOSE.csv conserva la correspondencia macroproceso, Bolt, procedimiento, caso y prompt.
Las pruebas existentes ejercitan partes de OPE-02, OPE-05, OPE-06 y APO-01. La aceptación completa de cada TC requiere registrar sus pasos particulares, no solo una suite relacionada.
TC-015 depende del aporte de Alex para confirmación simulada de citas.
TC-034/035/036 conservan pendiente la restauración completa con adjuntos y prueba de fallo parcial. La reconstrucción del laboratorio mediante semillas no acredita ese requisito.
APO-05 registra la regresión, las dependencias y los hallazgos. La ejecución actual de SonarQube y la revisión independiente quedan pendientes.
El Excel maestro se actualizará cuando Alex lo facilite, usando enlaces de PR, commits y resultados verificados. No se inventan enlaces de aceptación, integración ni revisión.

## Siguiente revisión
Alex debe revisar las aportaciones, decidir la integración y completar su parte. La rama de documentación puede actualizar las fichas después de integrar cada PR. Conservar el SHA final integrado y los enlaces de revisión para la matriz.
## Comparación de regresión frontend
Se repitieron los cinco archivos afectados sobre un snapshot de origin/main b3239ed, con las mismas dependencias.
Resultado del subconjunto en baseline: 39 casos, 34 aprobados y 5 fallidos. Los cinco fallos reproducidos corresponden a hashes AST históricos de Historias y otros componentes.
El fallo adicional de hash sobre App.jsx en la rama de insumos corresponde a la nueva ruta y requiere ajustar el contrato para conservar la comprobación de las rutas previas.
El fallo transitorio de impresión de Rx no se reprodujo en el snapshot. Requiere repetición aislada en la rama candidata.
## Cierre de la comparación
PR #3 documenta los siete macroprocesos junto con los aportes técnicos de PR #1 y PR #2.
El commit 8cea44faa3baa5c1076c9476016a9d5e9f204b41 ajusta la comprobación de App.jsx para admitir únicamente la ruta de inventario protegida y conservar el hash de las rutas anteriores. El caso específico pasó.
La repetición aislada de impresión Rx registró 1 aprobada y 1 fallida. El código y la prueba de ese componente permanecen iguales a la base. Su causa queda pendiente con Alex.
La ficha detallada de APO-02 se mantiene en PR #2 para evitar que el PR documental la sobrescriba.
El procedimiento de recuperación se encuentra en macroprocesos/APO-03/RESTAURACION_LAB.md; ejecución completa pendiente por ausencia de clientes pg_dump/pg_restore en el laboratorio actual.
