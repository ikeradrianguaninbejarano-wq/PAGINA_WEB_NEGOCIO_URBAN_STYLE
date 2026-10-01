import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const npmCommand = 'npm';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`)));
    child.on('error', reject);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:8000');
      if (response.ok) return;
    } catch {
      // Retry until the server is ready.
    }
    await delay(250);
  }
  throw new Error('El servidor local no quedó disponible para la prueba del navegador.');
}

async function main() {
  const server = spawn(process.execPath, ['scripts/serve.js'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  try {
    await waitForServer();
    await run(npmCommand, ['run', 'build'], { cwd: projectRoot });
    await run(npmCommand, ['run', 'test'], { cwd: projectRoot });
    await run(npmCommand, ['run', 'lint:html'], { cwd: projectRoot });
    await run(npmCommand, ['run', 'lint:quality'], { cwd: projectRoot });
    await run(npmCommand, ['run', 'test:browser'], { cwd: projectRoot, env: { ...process.env, TEST_URL: 'http://127.0.0.1:8000' } });
    console.log('CI local OK: build, pruebas unitarias, HTML, calidad accesible y navegador completados.');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
