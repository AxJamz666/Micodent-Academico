# TC-025 Conciliación histórica e idempotencia

Autor Jose Antonio Huaranga Salazar (joseHuaranga4198).
Base b3239ed28f09c59f31ab00a0f210ed1a46bf1909.
Ejecución 17 de noviembre de 2026, America/Lima.
Node v26.7.0, PostgreSQL 18.6, Windows, instancia desechable en loopback.

## Resultado
Comando desde backend/api:
node --test --test-concurrency=1 tests/postgres/u3b-conciliacion.test.cjs

Tres escenarios aprobados, cero fallos. Node contabiliza cuatro tests al incluir el contenedor.
- 201 asigna costos 80.00/20.00, bases 20.00/60.00, márgenes 0.00/48.00. Conserva comisiones 20.00/12.00 y todas las columnas de pagos.
- 200 reproduce el JSON guardado sin modificar las cinco tablas.
- 409 con clave nueva revierte la petición provisional sin modificar las cinco tablas.
Las instantáneas comparan pagos, finanzas_pagos, finanzas_costos, auditoria_financiera y finanzas_peticiones acotadas al fixture.
Se verifica un evento de auditoría y una petición persistida. El fixture se elimina al finalizar.

Comprobación adicional: npm test en backend/api, 115 aprobadas, cero fallos.
npm ci --ignore-scripts reportó 9 vulnerabilidades de dependencias (4 moderadas y 5 altas); requieren evaluación en APO-05.
Las credenciales aleatorias y el clúster se conservan fuera del repositorio.

Identificadores OPE-05 / PR-025 / MIC-BOLT-025 / TC-025 / AP-MP-08.
El resultado cubre TC-025. Los demás Bolts conservan sus estados hasta tener evidencia propia.
