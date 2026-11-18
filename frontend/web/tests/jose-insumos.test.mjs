import test from 'node:test';
import assert from 'node:assert/strict';
import { React, render, cleanup, fireEvent, screen, waitFor, disposeRuntime } from './helpers/component-runtime.mjs';
import api from './helpers/component-boundaries.mjs';
const { default: Insumos } = await import('../src/pages/Insumos.jsx');
test.afterEach(cleanup);
test.after(disposeRuntime);
test('APO-02 renders server inventory and keeps the operation key after a lost response', async () => {
  api.get = async () => ({ data: { data: [{id:7,nombre:'Material registrado',unidad:'caja',stock:4,minimo:4}] } });
  const calls = [];
  api.post = async (url, body, config) => {
    calls.push({url,body,key:config.headers['Idempotency-Key']});
    if(calls.length===1) throw new Error('Lost response');
    return {data:{ok:true}};
  };
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,'FormData');
  Object.defineProperty(globalThis,'FormData',{configurable:true,value:window.FormData});
  try {
    render(React.createElement(Insumos));
    await screen.findByRole('cell', {name:'Material registrado'});
    assert.ok(screen.getByText('Reponer'));
    fireEvent.change(screen.getByLabelText('Insumo'),{target:{value:'7'}});
    fireEvent.change(screen.getByLabelText('Cantidad'),{target:{value:'2'}});
    fireEvent.change(screen.getByLabelText('Motivo'),{target:{value:'Ingreso de prueba'}});
    fireEvent.submit(screen.getByLabelText('Cantidad').closest('form'));
    await screen.findByRole('alert');
    fireEvent.submit(screen.getByLabelText('Cantidad').closest('form'));
    await waitFor(()=>assert.equal(calls.length,2));
    assert.equal(calls[0].key,calls[1].key);
    assert.deepEqual(calls[0].body,calls[1].body);
  } finally {
    if(descriptor) Object.defineProperty(globalThis,'FormData',descriptor);
    else delete globalThis.FormData;
  }
});

