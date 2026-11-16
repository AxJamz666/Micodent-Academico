# Base universitaria PostgreSQL

[init.sql](init.sql) es el esquema consolidado. [seeds.sql](seeds.sql) contiene exclusivamente datos ficticios y exige dos hashes de credenciales independientes. El directorio [de migraciones PostgreSQL](postgresql/migrations/README.md) registra la secuencia incremental futura.

## Contrato del laboratorio

El bootstrap comprueba instancia local, nombre de base y propietario de laboratorio según la guarda U3B. Requiere base desechable vacía, cuenta propietaria sin privilegios globales, y una cuenta de aplicación con permisos mínimos. La identidad de ambos roles se comprueba también en las pruebas PostgreSQL. El script de preparación usa `APP_ENV=university`, `DB_ENGINE=postgres` y `U3B_SYNTHETIC=1`.

## Semillas y verificación

Inyectar, por un mecanismo local no versionado, dos valores aleatorios distintos en `U3B_SEED_ADMIN_PASSWORD` y `U3B_SEED_DOCTOR_PASSWORD`. La preparación deriva hashes bcrypt en memoria y los pasa en parámetros a la misma sesión PostgreSQL. Las contraseñas se vuelven a inyectar para los casos de login. En el módulo backend los comandos definidos son `npm run db:prepare:lab` y `npm run test:postgres`, con el rol apropiado en cada paso. La prueba agregada del candidato queda pendiente de un laboratorio PostgreSQL aislado. Si el bootstrap se interrumpe después del DDL puede quedar un esquema parcial. Revisar y recrear solo el blanco desechable autorizado antes de reintentar.

## Alcance de despliegue

El contrato existente fija host, base local y propietario. Para una plataforma institucional, la adaptación del bootstrap, el proxy/TLS y el almacenamiento requiere decisión y verificación propias.
