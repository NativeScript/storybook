import { frameworkPackages } from '@storybook/core-common';
import { resolve } from 'path';
import { middleware } from './src/middleware';

const AngularFramework = resolve(__dirname, './src/angular');
frameworkPackages[AngularFramework] = 'nativescript';

const VueFramework = resolve(__dirname, './src/vue');
frameworkPackages[VueFramework] = 'nativescript';

export { middleware, AngularFramework, VueFramework };
export default {
  middleware,
};

// import './src/register';
// export { middleware } from './src/middleware';
