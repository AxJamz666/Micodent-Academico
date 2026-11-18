BEGIN;
CREATE TABLE insumos (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 nombre VARCHAR(150) NOT NULL CHECK (length(trim(nombre)) > 0),
 unidad VARCHAR(30) NOT NULL CHECK (length(trim(unidad)) > 0),
 stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
 minimo INTEGER NOT NULL CHECK (minimo >= 0),
 creado_por VARCHAR(50) NOT NULL REFERENCES usuarios(id)
);
CREATE TABLE insumos_operaciones (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 insumo_id BIGINT NOT NULL REFERENCES insumos(id),
 usuario_id VARCHAR(50) NOT NULL REFERENCES usuarios(id),
 clave VARCHAR(80) NOT NULL,
 huella CHAR(64) NOT NULL,
 tipo VARCHAR(12) NOT NULL CHECK (tipo IN ('entrada','salida','reposicion')),
 cantidad INTEGER NOT NULL CHECK (cantidad > 0),
 motivo VARCHAR(500) NOT NULL,
 creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(usuario_id,clave)
);
GRANT SELECT,INSERT,UPDATE ON insumos TO micodent_u3b;
GRANT SELECT,INSERT ON insumos_operaciones TO micodent_u3b;
GRANT USAGE,SELECT ON SEQUENCE insumos_id_seq,insumos_operaciones_id_seq TO micodent_u3b;
COMMIT;
