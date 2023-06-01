import { dirname, join } from 'path';
import type { PresetProperty, StorybookConfig } from '@storybook/types';

const wrapForPnP = (input: string) =>
  dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('./vue-preset-cli-override'),
];

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>(
    'framework'
  );

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-webpack5') as '@storybook/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@storybook/vue'),
  };
};

export const typescript: PresetProperty<'typescript', StorybookConfig> = async (
  config
) => ({
  ...config,
  skipBabel: true,
});
