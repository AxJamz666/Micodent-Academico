const router = require('express').Router();
const { verificarToken, soloAdmin } = require('../middleware/auth');
const service = require('../services/insumos');
router.use(verificarToken, soloAdmin);
function endpoint(handler) {
  return async (req, res) => {
    try { await handler(req, res); }
    catch (error) { res.status(error.status || 500).json({ ok: false, mensaje: error.status ? error.message : 'No se pudo completar la operación de insumos.' }); }
  };
}
function itemId(req) {
  if (!/^[1-9][0-9]{0,15}$/.test(req.params.id)) throw Object.assign(new Error('ID inválido.'), {status: 400});
  return req.params.id;
}
router.get('/', endpoint(async (_req,res) => res.json({ok:true,data:await service.list()})));
router.post('/', endpoint(async (req,res) => res.status(201).json({ok:true,data:await service.create(req.body,req.usuario.id)})));
router.get('/:id/operaciones', endpoint(async (req,res) => res.json({ok:true,data:await service.history(itemId(req))})));
router.post('/:id/operaciones', endpoint(async (req,res) => {
  const result=await service.operate(itemId(req),req.body,req.usuario.id,req.get('Idempotency-Key'));
  res.status(result.status).json({ok:true,data:result.data});
}));
module.exports=router;
