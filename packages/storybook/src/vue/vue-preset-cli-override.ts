import * as webpack from 'webpack';
import { StorybookConfigOptions } from '@storybook/types';

export async function webpackFinal(
  baseConfig: webpack.Configuration,
  options: StorybookConfigOptions
): Promise<any> {
  console.log('webpackFinal --- ');
  const entry = [require.resolve('./web-entry')];

  // remove the VueLoaderPlugin - it can falsely report build errors
  // but we aren't even bundling .vue files in this preset.
  baseConfig.plugins = baseConfig.plugins.filter((plugin) => {
    return plugin.constructor.name !== 'VueLoaderPlugin';
  });

  // remove vue-loader
  baseConfig.module.rules = baseConfig.module.rules.filter((rule: any) => {
    if (typeof rule.loader === 'string') {
      return !rule.loader.includes('vue-loader');
    }
    return true;
  });

  // todo: perhaps we should provide a custom builder, or just use `webpack5-builder` defaults instead?

  return {
    ...baseConfig,
    entry,
  };
}
