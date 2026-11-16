import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const tests = readdirSync(new URL('tests/', root))
  .filter(name => name.endsWith('.test.mjs') && name !== 'academic-c-keyboard.test.mjs')
  .sort()
  .map(name => 'tests/' + name);

const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...tests], {
  cwd: fileURLToPath(root),
  stdio: 'inherit',
  windowsHide: true,
});
process.exitCode = result.status ?? 1;
