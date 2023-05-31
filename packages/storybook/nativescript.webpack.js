const { IgnorePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const { existsSync } = require('fs');

module.exports = (webpack) => {
  // todo: have a default entry that notes the selected flavor is unsupported or something
  let sbEntryPath = '';

  const flavorName = webpack.Utils.flavor.determineProjectFlavor();
  if (flavorName && ['vue', 'angular'].includes(flavorName)) {
    // supported flavor, resolve entry path...
    sbEntryPath = resolve(__dirname, `./device/${flavorName}/entry`);
  }

  webpack.chainWebpack((config, env) => {
    const dirPath = webpack.Utils.platform.getEntryDirPath();
    const platform = webpack.Utils.platform.getPlatformName();

    if (env.storybook) {
      const polyfillsPath =
        [
          resolve(dirPath, `polyfills.${platform}.ts`),
          resolve(dirPath, `polyfills.ts`),
        ].find((path) => existsSync(path)) || '@nativescript/core/globals/index.js';

      const bundle = config.entry('bundle').clear();

      bundle.add(polyfillsPath).add('@nativescript/core/bundle-entry-points');

      if (flavorName === 'angular') {
        bundle.add('@valor/nativescript-websockets').add('@angular/compiler');
      }

      bundle.add(sbEntryPath);

      const websocketAddr = `${env.storybookSecure ? 'wss' : 'ws'}://${
        env.storybookHost || (platform === 'android' ? '10.0.2.2:8080' : '127.0.0.1:8080')
      }`;

      config.plugin('DefinePlugin').tap((args) => {
        args[0] = merge(args[0], {
          NSC_STORYBOOK_WS_ADDRESS: JSON.stringify(websocketAddr),
        });

        return args;
      });

      env.storybookTsConfig = env.storybookTsConfig || env.storybookTSConfig;
      const defaultTsConfig = webpack.Utils.project.getProjectFilePath(
        'tsconfig.storybook.json'
      );
      const tsConfigPath =
        env.storybookTsConfig ||
        (require('fs').existsSync(defaultTsConfig) ? defaultTsConfig : undefined);

      if (tsConfigPath) {
        config.when(config.module.rules.has('ts'), (config) =>
          config.module
            .rule('ts')
            .uses.get('ts-loader')
            .options(
              merge(config.module.rule('ts').uses.get('ts-loader').get('options'), {
                configFile: tsConfigPath,
              })
            )
        );
        config.when(config.plugins.has('AngularWebpackPlugin'), (config) =>
          config.plugin('AngularWebpackPlugin').tap((args) => {
            args[0] = merge(args[0], { tsconfig: tsConfigPath });
            return args;
          })
        );
      }

      config.when(config.plugins.has('AngularWebpackPlugin'), (config) =>
        config.plugin('AngularWebpackPlugin').tap((args) => {
          args[0] = merge(args[0], { jitMode: true });
          return args;
        })
      );

      config.when(config.module.rules.has('angular-webpack-loader'), (config) => {
        const options = config.module
          .rule('angular-webpack-loader')
          .uses.get('webpack-loader')
          .get('options');
        config.module
          .rule('angular-webpack-loader')
          .uses.get('webpack-loader')
          .options(merge(options, { aot: false, optimize: false }));
      });

      if (webpack.Utils.platform.getPlatformName() === 'android') {
        config
          .entry('bundle')
          .add('@nativescript/core/ui/frame')
          .add('@nativescript/core/ui/frame/activity');
      }
    } else {
      // prevent storybook stories from being bundled into the app when not running storybook
      config.plugin('IgnorePlugin|storybook').use(IgnorePlugin, [
        {
          checkResource(resource, context) {
            if (context === webpack.Utils.platform.getEntryDirPath()) {
              if (/\.stories\.(ts|js)$/.test(resource)) {
                return true;
              }
            }
            return false;
          },
        },
      ]);
    }
  });
};
