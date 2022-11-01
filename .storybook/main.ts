module.exports = {
  stories: ['apps/**/*.stories.ts'],
  addons: ['@storybook/addon-controls', '@storybook/native-addon/dist/register.js'],
  framework: '@storybook/angular',
  core: {
    builder: 'webpack5',
  },
};
