# Recuperación PostgreSQL y adjuntos en laboratorio

Responsable de documentación Jose Antonio Huaranga Salazar. Ensayo completo NO EJECUTADO.
TC-034 / TC-035 / TC-036. Este procedimiento queda para verificación en un destino desechable.

## Preparación
Disponer de pg_dump, pg_restore y psql de versión compatible con PostgreSQL 18.6.
El laboratorio preparado en esta actividad incluye servidor, initdb y pg_ctl; no incluye esos clientes.
Usar dos bases desechables identificadas, origen y destino vacío, más una carpeta de adjuntos ficticios.
Validar identidad, host loopback, propietario y roles antes de ejecutar comandos.
Conservar credenciales en un archivo de servicio privado o variables locales. No guardarlas en el respaldo ni el repositorio.

## TC-034 Consistencia
Detener las escrituras de la aplicación y las cargas de adjuntos durante la ventana de captura.
Registrar fecha, versión, SHA de código, versión de esquema y listado de adjuntos con SHA-256.
Ejecutar pg_dump --format=custom con el origen explícito y destino de archivo temporal.
Confirmar exit code cero, validar pg_restore --list y calcular SHA-256 del dump.
Solo entonces publicar el paquete como candidato a recuperación.
Incluir manifiesto de adjuntos y copia de los archivos ficticios. Un dump SQL sin sus adjuntos no basta.

## TC-035 Restauración aislada
Comprobar que la base destino es desechable y vacía.
Crear los roles y permisos previstos sin copiar privilegios globales.
Ejecutar pg_restore --exit-on-error --single-transaction sobre el destino.
Restaurar los adjuntos en una carpeta aislada y comparar cada hash con el manifiesto.
Comparar conteos por tabla y referencias, comisiones y totales financieros exactos.
Iniciar una instancia de aplicación aislada y verificar salud, sesión, ficha y acceso al adjunto.
Registrar duración de respaldo y restauración. RPO y RTO se fijan con el interesado a partir de esas mediciones.

## Fallo parcial
Crear una copia dañada del paquete candidato o retirar un adjunto ficticio de esa copia.
La verificación debe rechazarlo y mantener el último paquete recuperable.
No promover un paquete si falla el dump, la restauración, la integridad o el acceso al adjunto.
La transacción SQL fallida se revierte. La restauración de archivos se realiza en una carpeta candidata que se descarta si no valida.

## TC-036 Retención
Inventariar paquetes con fecha, versión, hash y resultado de restauración.
Validar otra vez el último paquete aprobado antes de proponer un retiro.
Ensayar la retención sobre copias ficticias, conservar al menos una copia recuperable y registrar la decisión.
La cantidad y antigüedad finales se acordarán con el responsable. Esta actividad no eliminó respaldos existentes.
