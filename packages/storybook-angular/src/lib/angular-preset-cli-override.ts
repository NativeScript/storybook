import * as webpack from 'webpack';
import { logger } from '@storybook/node-logger';
import { BuilderContext, targetFromTargetString } from '@angular-devkit/architect';
import { sync as findUpSync } from 'find-up';
import { dedent } from 'ts-dedent';
import { JsonObject, logging } from '@angular-devkit/core';
import { StorybookConfigOptions } from '@storybook/types';
import { cwd } from 'process';
import { default as StorybookNormalizeAngularEntryPlugin } from '@storybook/angular/dist/server/plugins/storybook-normalize-angular-entry-plugin';
import { filterOutStylingRules } from '@storybook/angular/dist/server/utils/filter-out-styling-rules';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

export async function webpackFinal(baseConfig: webpack.Configuration, options: StorybookConfigOptions): Promise<any> {
  // @ts-ignore
  const cliConfig = require(require.resolve('./webpack.config.js', { paths: [cwd()] }))({
    production: false,
    platform: 'ios',
    storybookWeb: true,
    noHmr: true,
    disableAOT: true,
  });
  /**
   * Merge baseConfig Webpack with angular-cli Webpack
   */
  const entry = ['./src/dummy.ts', ...(baseConfig.entry as any), ...(cliConfig.entry.styles ?? []), ...(cliConfig.entry.polyfills ?? [])];
  // Don't use storybooks styling rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.
  const rulesExcludingStyles = filterOutStylingRules(baseConfig);
  const module = {
    ...baseConfig.module,
    rules: [...cliConfig.module.rules, ...rulesExcludingStyles],
  };
  const plugins = [...(cliConfig.plugins ?? []), ...baseConfig.plugins, new StorybookNormalizeAngularEntryPlugin(null)];
  const resolve = {
    ...baseConfig.resolve,
    modules: Array.from(new Set([...baseConfig.resolve.modules, ...cliConfig.resolve.modules])),
    // plugins: [
    //     new TsconfigPathsPlugin({
    //         configFile: builderOptions.tsConfig,
    //         mainFields: ['browser', 'module', 'main'],
    //     }),
    // ],
  };

  return {
    ...baseConfig,
    entry,
    module,
    plugins,
    resolve,
    resolveLoader: cliConfig.resolveLoader,
  };
}
