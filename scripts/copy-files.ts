import { resolve } from 'path';
import { copyFile } from 'fs/promises';
import { move } from 'fs-extra';
import { cwd } from 'process';

const files = ['README.md'];

export const rootDir = resolve(__dirname, '../');
const currentWorkingDir = cwd();
const packageDir = resolve(currentWorkingDir, './build');

const packageFolderName = currentWorkingDir.split('/').reverse()[0];

if (!packageFolderName) {
  throw new Error('Package not found');
}

async function run(): Promise<void> {
  await move(resolve(rootDir, `./build/${packageFolderName}/src`), packageDir);

  for (const file of files) {
    await copyFile(resolve(currentWorkingDir, `./${file}`), resolve(packageDir, `./${file}`));
  }
}

run();
