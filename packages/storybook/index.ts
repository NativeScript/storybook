import { middleware } from './src/middleware';
const path = require('path');

const AngularFramework = path.resolve(__dirname, './src/angular'); // path.dirname(require.resolve('@nativescript/storybook/package.json'));
import { frameworkPackages } from '@storybook/core-common';
frameworkPackages[AngularFramework] = 'nativescript';

export { middleware, AngularFramework };
export default {
  middleware,
};

// import './src/register';
// export { middleware } from './src/middleware';
