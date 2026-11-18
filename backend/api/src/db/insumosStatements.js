module.exports = [
  {
    "id": "JOSE-STOCK-1",
    "mysql": "SELECT * FROM insumos ORDER BY id",
    "postgres": "SELECT * FROM insumos ORDER BY id",
    "parameters": 0,
    "lock": false
  },
  {
    "id": "JOSE-STOCK-2",
    "mysql": "INSERT INTO insumos(nombre,unidad,minimo,creado_por) VALUES(?,?,?,?) RETURNING id",
    "postgres": "INSERT INTO insumos(nombre,unidad,minimo,creado_por) VALUES($1,$2,$3,$4) RETURNING id",
    "parameters": 4,
    "lock": false
  },
  {
    "id": "JOSE-STOCK-3",
    "mysql": "SELECT * FROM insumos WHERE id=? FOR UPDATE",
    "postgres": "SELECT * FROM insumos WHERE id=$1 FOR UPDATE",
    "parameters": 1,
    "lock": true
  },
  {
    "id": "JOSE-STOCK-4",
    "mysql": "SELECT * FROM insumos_operaciones WHERE usuario_id=? AND clave=?",
    "postgres": "SELECT * FROM insumos_operaciones WHERE usuario_id=$1 AND clave=$2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "JOSE-STOCK-5",
    "mysql": "INSERT INTO insumos_operaciones(insumo_id,usuario_id,clave,huella,tipo,cantidad,motivo) VALUES(?,?,?,?,?,?,?) RETURNING id",
    "postgres": "INSERT INTO insumos_operaciones(insumo_id,usuario_id,clave,huella,tipo,cantidad,motivo) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
    "parameters": 7,
    "lock": false
  },
  {
    "id": "JOSE-STOCK-6",
    "mysql": "UPDATE insumos SET stock=? WHERE id=?",
    "postgres": "UPDATE insumos SET stock=$1 WHERE id=$2",
    "parameters": 2,
    "lock": false
  },
  {
    "id": "JOSE-STOCK-7",
    "mysql": "SELECT * FROM insumos_operaciones WHERE insumo_id=? ORDER BY id DESC",
    "postgres": "SELECT * FROM insumos_operaciones WHERE insumo_id=$1 ORDER BY id DESC",
    "parameters": 1,
    "lock": false
  }
];
