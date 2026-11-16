# MICODENT Académico

Base universitaria PostgreSQL para evaluación privada con datos sintéticos. Esta entrega inicial reúne el código común y la documentación académica de Alex.

## Estructura

- [Catálogo de macroprocesos](docs/arista/README.md)
- [Frontend](frontend/web/package.json) · React/Vite, scripts, unitarias y Cypress
- [Backend](backend/api/package.json) · Express, perfil universidad y pruebas
- [Base PostgreSQL de laboratorio](database/README.md) · DDL, semillas y guardas de identidad

## Preparación y pruebas

Usar el perfil `APP_ENV=university` y `DB_ENGINE=postgres`. Ejecutar módulos en un entorno aislado y con dependencias revisadas. El runtime universitario escucha en todas las interfaces del entorno asignado. La exposición de red depende del entorno de laboratorio. Las pruebas unitarias y el build admiten validación separada de la prueba PostgreSQL real. Los detalles del bootstrap están en el README de base. La suite de accesibilidad de teclado se ejecuta por separado con `npm run test:keyboard` y requiere Playwright y Edge existentes, con `MICODENT_PLAYWRIGHT_MODULE` apuntando al módulo local. Si Edge requiere una ruta explícita, usar `MICODENT_BROWSER_EXECUTABLE`. La suite Cypress conserva su comando de prueba y requiere provisión de su navegador.

## Procedencia

El código y las pruebas importados provienen de la edición universitaria congelada. Las adaptaciones de preparación se registran en el manifiesto local de Fase 2A. El commit de importación registra la incorporación de la base y la documentación. Los aportes técnicos posteriores conservarán su autoría y evidencia propias.

## Alcance académico inicial

Se documentan siete macroprocesos y veintidós Bolts del alcance de Alex. Los otros siete destinos del catálogo quedan reservados. La prueba adicional de adendas requiere su propia ejecución PostgreSQL.
