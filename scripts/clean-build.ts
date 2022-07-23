import { readdir, rm } from 'fs/promises';
import { resolve } from 'path/posix';

const buildDir = resolve(__dirname, '../build');
const packagesDir = resolve(__dirname, '../packages');

const run = async (): Promise<void> => {
  const dirs = await readdir(packagesDir, { withFileTypes: true });

  for (const item of dirs) {
    if (item.isDirectory()) {
      await rm(resolve(packagesDir, `./${item.name}/build`), { recursive: true, force: true });
    }
  }

  await rm(buildDir, { recursive: true, force: true });
};

run();
