import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'design-system',
  taskQueue: 'async',
  sourceMap: true,
  globalStyle: 'src/global.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
  ],
  extras: {
    experimentalImportInjection: true,
  },
};
