import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envExamplePath = path.join(rootDir, '.env.example');
const envTemplatePath = path.join(rootDir, '.env.template');

function copyIfMissing(sourcePath, targetPath) {
  if (fs.existsSync(targetPath)) {
    return false;
  }

  if (!fs.existsSync(sourcePath)) {
    return false;
  }

  fs.copyFileSync(sourcePath, targetPath);
  return true;
}

const createdFromExample = copyIfMissing(envExamplePath, envLocalPath);
const createdFromTemplate = !createdFromExample && copyIfMissing(envTemplatePath, envLocalPath);

if (createdFromExample || createdFromTemplate) {
  const source = createdFromExample ? '.env.example' : '.env.template';
  console.log(`Created .env.local from ${source}.`);
} else if (fs.existsSync(envLocalPath)) {
  console.log('.env.local already exists.');
} else {
  console.log('No environment template was copied because neither .env.example nor .env.template was found.');
}

console.log('Local setup complete.');
