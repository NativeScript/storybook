import * as webpack from 'webpack';
import { StorybookConfigOptions } from '@storybook/types';

export async function webpackFinal(
  baseConfig: webpack.Configuration,
  options: StorybookConfigOptions
): Promise<any> {
  console.log('webpackFinal --- ');
  const entry = [require.resolve('./web-entry')];

  return {
    ...baseConfig,
    entry,
  };
}
