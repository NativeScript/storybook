module.exports = {
  stories: ['../app/**/*.stories.js'],
  /* prettier-ignore */
  addons: [
    '@storybook/addon-actons',
    // '@storybook/addon-links',
    // '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@nativescript/storybook'
  ],
  core: {
    builder: 'webpack5',
  },
  framework: '@storybook/vue',
};
