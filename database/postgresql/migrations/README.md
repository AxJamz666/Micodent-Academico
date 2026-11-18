# Migraciones incrementales PostgreSQL

El baseline se prepara desde database/init.sql y seeds.sql.
Después del baseline, aplicar 001_insumos.sql una sola vez como propietario.
Esta migración añade inventario vacío, movimientos y solicitudes auditables.
Revisar y registrar el SHA-256 del archivo utilizado antes de ejecutarlo.
El bloque BEGIN/COMMIT revierte el DDL completo si falla.
La migración otorga al rol de aplicación SELECT/INSERT/UPDATE en insumos y SELECT/INSERT en insumos_operaciones. Los movimientos no se borran desde la aplicación.

Ver docs/arista/macroprocesos/APO-02/README.md para actualización y reversión.
