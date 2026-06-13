import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pkgJsonPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
const requiredNodeVersion = pkg.engines?.node ?? '>=20.11.0 <24';
const nodeVersion = process.versions.node;

function ensureNodeVersion() {
  const [major, minor] = nodeVersion.split('.').map(Number);
  const supportedMajor = major >= 20 && major < 24;
  const supportedMinor = major > 20 || minor >= 11;

  if (!supportedMajor || !supportedMinor) {
    console.error(`Node.js ${requiredNodeVersion} is required. Current version: ${nodeVersion}`);
    console.error('Recommended version: Node.js 22 LTS');
    process.exit(1);
  }
}

function run(command) {
  execSync(command, {
    cwd: rootDir,
    stdio: 'inherit',
  });
}

ensureNodeVersion();

console.log(`Using Node.js ${nodeVersion}`);
console.log('Installing dependencies...');
run('npm install');

console.log('Preparing local environment...');
run('node scripts/setup-local.mjs');

console.log('');
console.log('TN-OSIRIS is ready.');
console.log('Starting the local development server...');
console.log('Open http://localhost:3000 or http://127.0.0.1:3000 once the server is ready.');
console.log('');

run('npm run dev:host');
