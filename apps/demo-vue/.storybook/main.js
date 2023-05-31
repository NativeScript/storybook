const { VueFramework } = require('@nativescript/storybook');

module.exports = {
  stories: ['../app/**/*.stories.ts'],
  addons: [
    '@storybook/addon-controls',
    '@nativescript/storybook',
    // ...
  ],
  framework: VueFramework,
};
