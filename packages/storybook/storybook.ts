import { buildDevStandalone } from '@storybook/core-server';

buildDevStandalone({
  configDir: '.storybook',
  packageJson: require('./package.json'),
  // NOTE: Eduardo, we need to sort out what would be required here
  angularBrowserTarget: 'nsStorybookAngular:ios',
} as any);
