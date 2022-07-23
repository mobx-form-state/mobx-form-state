import { resolve } from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { rootDir } from '@react-run/app/webpack/paths';

export const webpackConfig = (config: Configuration): Configuration =>
  merge(config, {
    resolve: {
      alias: {
        '@mobx-form-state/core': resolve(rootDir, '../packages/core/src'),
        '@mobx-form-state/react': resolve(rootDir, '../packages/react/src'),
        '@mui/styled-engine': '@mui/styled-engine-sc',
      },
    },
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
      ],
    },
  });
