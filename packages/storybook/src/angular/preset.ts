import * as sbAngular from '@storybook/angular/dist/preset';
import { PresetProperty, PresetValue, StorybookConfig } from '@storybook/types';

export * from '@storybook/angular/dist/preset';
import { previewAnnotations as originalAnnotations } from '@storybook/angular/dist/preset';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('./angular-preset-cli-override'),
  // require.resolve('@storybook/angular/dist/server/framework-preset-angular-cli'),
  require.resolve('@storybook/angular/dist/server/framework-preset-angular-ivy'),
  //   require.resolve('@storybook/angular/dist/server/framework-preset-angular-docs'),
];

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entries = []) => [...entries, require.resolve('./config')];
