import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Insumos() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null);
  const [selected, setSelected] = useState('');
  async function load() {
    const response = await api.get('/insumos');
    setItems(response.data.data);
  }
  useEffect(() => { load().catch(() => setError('No se pudo consultar el inventario.')); }, []);
  async function run(action) {
    setBusy(true); setError('');
    try { await action(); await load(); }
    catch (e) { if (e.response?.status >= 400 && e.response.status < 500) setPending(null); setError(e.response?.data?.mensaje || 'No se pudo confirmar. Puedes reintentar la misma operación.'); }
    finally { setBusy(false); }
  }
  function create(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    run(async () => {
      await api.post('/insumos', { nombre: values.get('nombre'), unidad: values.get('unidad'), minimo: Number(values.get('minimo')) });
      form.reset();
    });
  }
  function movement(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const operation = pending || {
      id: selected, key: crypto.randomUUID(),
      body: { tipo: values.get('tipo'), cantidad: Number(values.get('cantidad')), motivo: values.get('motivo') },
    };
    setPending(operation);
    run(async () => {
      await api.post('/insumos/' + operation.id + '/operaciones', operation.body, { headers: { 'Idempotency-Key': operation.key } });
      setPending(null);
      const response = await api.get('/insumos/' + operation.id + '/operaciones');
      setHistory(response.data.data);
    });
  }
  return <main className="mx-auto max-w-6xl space-y-6 p-6">
    <h1 className="text-2xl font-bold">Insumos clínicos</h1>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <section className="rounded-lg border bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">Registrar insumo</h2>
      <form onSubmit={create} className="flex flex-wrap gap-4">
        <label>Nombre<input className="ui-input" name="nombre" maxLength={150} required /></label>
        <label>Unidad<input className="ui-input" name="unidad" maxLength={30} required /></label>
        <label>Stock mínimo<input className="ui-input" name="minimo" type="number" min="0" max="2147483647" step="1" required /></label>
        <button className="ui-btn-primary" disabled={busy}>Registrar</button>
      </form>
    </section>
    <section className="overflow-x-auto rounded-lg border bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">Inventario</h2>
      <table className="w-full text-left"><thead><tr>{['Nombre','Unidad','Stock','Mínimo','Estado'].map(v => <th key={v} className="p-2">{v}</th>)}</tr></thead>
        <tbody>{items.map(item => <tr key={item.id}><td className="p-2">{item.nombre}</td><td>{item.unidad}</td><td>{item.stock}</td><td>{item.minimo}</td><td>{item.stock <= item.minimo ? 'Reponer' : 'Disponible'}</td></tr>)}</tbody>
      </table>
      {!items.length && <p>Aún no hay insumos registrados.</p>}
    </section>
    <section className="rounded-lg border bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold">Movimiento o solicitud de reposición</h2>
      <form onSubmit={movement} className="flex flex-wrap gap-4">
        <label>Insumo<select className="ui-input" value={selected} onChange={e => { setSelected(e.target.value); setHistory([]); }} required disabled={!!pending || busy}>
          <option value="">Selecciona un insumo</option>{items.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select></label>
        <label>Operación<select className="ui-input" name="tipo" disabled={!!pending || busy}><option value="entrada">Entrada</option><option value="salida">Salida</option><option value="reposicion">Solicitar reposición</option></select></label>
        <label>Cantidad<input className="ui-input" name="cantidad" type="number" min="1" max="2147483647" required disabled={!!pending || busy} /></label>
        <label>Motivo<input className="ui-input" name="motivo" maxLength={500} required disabled={!!pending || busy} /></label>
        <button className="ui-btn-primary" disabled={busy || !selected}>{pending ? 'Reintentar operación' : 'Confirmar'}</button>
      </form>
      <button className="mt-3 underline" disabled={busy || !selected} onClick={() => run(async () => { const r = await api.get('/insumos/' + selected + '/operaciones'); setHistory(r.data.data); })}>Consultar movimientos</button>
      <ul>{history.map(row => <li className="border-b py-2" key={row.id}>{row.tipo} · {row.cantidad} · {row.motivo} · {row.usuario_id} · {String(row.creado_en)}</li>)}</ul>
    </section>
  </main>;
}
