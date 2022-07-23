import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';

const currentWorkingDir = cwd();
const packageDir = resolve(currentWorkingDir, './build');

const copyPackagesJson = async (): Promise<void> => {
  const packageJsonRaw = await readFile(resolve(currentWorkingDir, './package.json'), { encoding: 'utf8' });

  const packageJson = JSON.parse(packageJsonRaw);

  delete packageJson.scripts;

  await writeFile(resolve(packageDir, './package.json'), JSON.stringify(packageJson, undefined, 2), {
    encoding: 'utf8',
  });
};

copyPackagesJson();
