// module.exports = {
//   stories: ['../src/**/*.stories.ts'],
//   addons: ['@storybook/addon-controls', '@storybook/native-addon/dist/register.js'],
//   framework: '@storybook/angular',
//   core: {
//     builder: 'webpack5',
//   },
// };

const { AngularFramework } = require('@nativescript/storybook');

module.exports = {
  stories: ['../src/**/*.stories.ts'],
  /* prettier-ignore */
  addons: [
    // '@storybook/addon-actions',
    '@storybook/addon-controls',
    // '@storybook/addon-links',
    // '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@nativescript/storybook'
  ],
  core: {
    builder: 'webpack5',
  },
  framework: AngularFramework,
};
