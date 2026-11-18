const { createHash } = require('node:crypto');
const db = require('../config/db');
const sql = {
  list: 'SELECT * FROM insumos ORDER BY id',
  create: 'INSERT INTO insumos(nombre,unidad,minimo,creado_por) VALUES(?,?,?,?) RETURNING id',
  lock: 'SELECT * FROM insumos WHERE id=? FOR UPDATE',
  replay: 'SELECT * FROM insumos_operaciones WHERE usuario_id=? AND clave=?',
  insert: 'INSERT INTO insumos_operaciones(insumo_id,usuario_id,clave,huella,tipo,cantidad,motivo) VALUES(?,?,?,?,?,?,?) RETURNING id',
  stock: 'UPDATE insumos SET stock=? WHERE id=?',
  history: 'SELECT * FROM insumos_operaciones WHERE insumo_id=? ORDER BY id DESC',
};
function fail(message, status = 400) { throw Object.assign(new Error(message), { status }); }
function integer(value, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum || value > 2147483647) fail('Cantidad entera fuera de rango.');
  return value;
}
function text(value, max) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) fail('Texto obligatorio o demasiado largo.');
  return value.trim();
}
async function list() { const [rows] = await db.query(sql.list); return rows; }
async function create(body, actor) {
  const [result] = await db.query(sql.create, [text(body.nombre, 150), text(body.unidad, 30), integer(body.minimo), actor]);
  return { id: result.insertId };
}
async function history(id) {
  const [rows] = await db.query(sql.history, [id]);
  return rows;
}
async function operate(id, body, actor, key) {
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(key || '')) fail('Clave de idempotencia requerida.');
  const quantity = integer(body.cantidad, 1);
  const reason = text(body.motivo, 500);
  if (!['entrada', 'salida', 'reposicion'].includes(body.tipo)) fail('Tipo de movimiento inválido.');
  const hash = createHash('sha256').update(JSON.stringify([String(id), body.tipo, quantity, reason])).digest('hex');
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Serializes all operations for this item, including retries.
    const [[item]] = await conn.query(sql.lock, [id]);
    if (!item) fail('Insumo no encontrado.', 404);
    const [[prior]] = await conn.query(sql.replay, [actor, key]);
    if (prior) {
      if (prior.huella !== hash) fail('La clave ya corresponde a otra operación.', 409);
      await conn.commit();
      return { status: 200, data: prior };
    }
    let stock = item.stock;
    if (body.tipo === 'entrada') stock += quantity;
    if (body.tipo === 'salida') stock -= quantity;
    if (stock < 0) fail('Stock insuficiente.', 409);
    integer(stock);
    await conn.query(sql.insert, [id, actor, key, hash, body.tipo, quantity, reason]);
    if (body.tipo !== 'reposicion') await conn.query(sql.stock, [stock, id]);
    const [[operation]] = await conn.query(sql.replay, [actor, key]);
    await conn.commit();
    return { status: 201, data: operation };
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') fail('Clave de operación ya utilizada.', 409);
    throw error;
  } finally { conn.release(); }
}
module.exports = { sql, list, create, operate, history };
