import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createViteConfig } from '../vite.config.js';

test('U2 Vite keeps local defaults and consumes dynamic module PORT/HOST', () => {
  const local = createViteConfig();
  assert.equal(local.server.port, 5173);
  assert.equal(local.preview.port, 4173);
  assert.equal(local.server.proxy['/api'].target, 'http://127.0.0.1:4000');
  assert.equal(local.server.proxy['/api'].changeOrigin, false);
  const university = createViteConfig({ PORT: '4241', HOST: '0.0.0.0',
    DEV_API_PROXY_TARGET: 'http://127.0.0.1:3041' });
  assert.equal(university.server.port, 4241);
  assert.equal(university.preview.port, 4241);
  assert.equal(university.server.host, '0.0.0.0');
  assert.equal(university.server.proxy['/api'].target, 'http://127.0.0.1:3041');
  assert.equal(university.preview.proxy, undefined, 'Vite proxy is development-only');
});

test('U2 Vite rejects malformed ports and external or credentialed DEV targets', () => {
  for (const PORT of ['0', '65536', '-1', '42x', ' 4200']) {
    assert.throws(() => createViteConfig({ PORT }), /VITE_PORT_INVALID/);
  }
  for (const DEV_API_PROXY_TARGET of ['not-a-url', 'https://external.invalid', 'http://synthetic:only@localhost:3000',
    'http://localhost:3000/api', 'http://localhost:3000?data=1', 'http://localhost:3000#fragment']) {
    assert.throws(() => createViteConfig({ DEV_API_PROXY_TARGET }), /VITE_DEV_PROXY_INVALID/);
  }
});

test('U2 frontend retains actual relative API and credentialed transport', () => {
  const source = readFileSync(new URL('../src/services/api.js', import.meta.url), 'utf8');
  assert.match(source, /baseURL: '\/api'/);
  assert.match(source, /withCredentials: true/);
  assert.ok(!source.includes('VITE_API_URL'));
});
