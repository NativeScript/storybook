// module.exports = {
//   stories: ['../src/**/*.stories.ts'],
//   addons: ['@storybook/addon-controls', '@storybook/native-addon/dist/register.js'],
//   framework: '@storybook/angular',
//   core: {
//     builder: 'webpack5',
//   },
// };
const path = require('path');

const frameworkName = path.dirname(require.resolve('@nativescript/storybook-angular/package.json'));
import { frameworkPackages } from '@storybook/core-common';
frameworkPackages[frameworkName] = 'angular';

module.exports = {
  stories: ['../src/**/*.stories.ts'],
  /* prettier-ignore */
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    // '@storybook/addon-links',
    // '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@nativescript/storybook'
  ],
  core: {
    builder: 'webpack5',
  },
  framework: frameworkName,
  // framework: '@storybook/angular',
};
