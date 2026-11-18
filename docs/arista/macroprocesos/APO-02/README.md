# APO-02 Gestión de insumos clínicos

Autor Jose Antonio Huaranga Salazar. Cuenta joseHuaranga4198.
Aportación PostgreSQL del 17 de noviembre de 2026.

## Alcance implementado
La pantalla /insumos permite registrar nombre, unidad y mínimo desde formularios.
El stock comienza en cero. Las entradas, salidas y solicitudes de reposición se registran mediante API y se conservan en PostgreSQL.
La solicitud registra necesidad de reposición; la recepción se registra como una entrada.
El indicador Reponer usa stock menor o igual al mínimo.
El historial conserva cantidad, tipo, motivo, actor y fecha.
Acceso administrativo con la sesión y CSRF existentes.

## Bolts y evidencia
- MIC-BOLT-031 / PR-031 / TC-031: consulta de stock mínimo; límite exacto verificado en PostgreSQL.
- MIC-BOLT-032 / PR-032 / TC-032: solicitud persistida e idempotente; no altera el saldo.
- MIC-BOLT-033 / PR-033 / TC-033: entradas y salidas transaccionales, rechazo de saldo negativo y duplicados. Dos salidas concurrentes verificadas.

Código en backend/api/src/services/insumos.js, routes/insumos.routes.js y db/insumosStatements.js.
Interfaz en frontend/web/src/pages/Insumos.jsx, con navegación y ruta administrativa.
Prueba en backend/api/tests/postgres/jose-insumos.test.cjs.

## Instalación y actualización
Aplicar una sola vez database/postgresql/migrations/001_insumos.sql con el rol propietario después del baseline.
La transacción falla sin aplicar parcialmente el esquema. Revisar si ya existen las tablas antes de repetir.
No usar db:prepare:lab sobre una base existente. La migración crea tablas vacías y concede permisos limitados a micodent_u3b.
La API se habilita en APP_ENV=university. Publicar primero el esquema y después el backend/frontend.
Respaldo previo obligatorio para actualizar una instalación con información.
Para revertir la aplicación, retirar la versión candidata y conservar las tablas y registros para revisión.

## Resultado de prueba
Windows, Node v26.7.0, PostgreSQL 18.6, laboratorio local desechable.
node --test --test-concurrency=1 tests/postgres/jose-insumos.test.cjs
Aprobada la prueba HTTP de integración. Verifica persistencia, umbral exacto, historial, duplicados, cantidades inválidas, salidas concurrentes y permisos 401/403.
npm run build en frontend/web aprobado. No se realizó recorrido manual del navegador.
El fixture es exclusivo del laboratorio. La aplicación obtiene el inventario del servidor.
## Regresión y límites de aceptación
La suite PostgreSQL conjunta u3b-runtime.test.cjs y jose-insumos.test.cjs aprobó 17 pruebas con ICU es-PE.
El verificador de salud reconoce las 35 tablas del baseline y las dos tablas de inventario.
Prueba de componente jose-insumos.test.mjs aprobada: representa el inventario devuelto por la API y conserva la clave de operación cuando se pierde la respuesta.
npm test del backend aprobó 115 pruebas.
La suite completa del frontend registró 151 casos, 144 aprobados y 7 fallidos. Se investiga su reproducción en el baseline; no se declara una regresión global aprobada.
La instalación del frontend reportó 18 vulnerabilidades (6 moderadas y 12 altas), además de las 9 del backend. El build aprobó con aviso de chunk superior a 500 kB.
## Comparación final
En un snapshot intacto de origin/main se ejecutaron los cinco archivos involucrados en los fallos: 39 casos, 34 aprobados y 5 fallidos por fingerprints históricos. La incorporación de la ruta /insumos requiere una excepción explícita en la comprobación histórica de App.jsx; se verifica su guarda AdminRoute y se comparan las rutas anteriores conservando el hash previo. Esa comprobación específica pasó.
La prueba aislada de impresión de Rx volvió a fallar en el candidato (1/2). Los archivos clínicos y la prueba tienen los mismos bytes que origin/main; la causa del fallo permanece pendiente de análisis con Alex.
La suite global no se declara aprobada. No se sustituyeron los cinco hashes históricos por hashes nuevos.
