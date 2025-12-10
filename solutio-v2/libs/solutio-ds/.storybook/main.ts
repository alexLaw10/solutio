import type { StorybookConfig } from '@storybook/web-components';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/web-components',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../loader'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

export default config;
