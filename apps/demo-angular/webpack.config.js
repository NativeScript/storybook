const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('angular');

  webpack.chainWebpack((config) => {
    // shared demo code
    config.resolve.alias.set('@demo/shared', resolve(__dirname, '..', '..', 'tools', 'demo'));
    config.resolve.alias.set('storybook-src', resolve(__dirname));

    // polyfills
    config.resolve.set(
      'fallback',
      Object.assign({}, config.resolve.get('fallback'), {
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        tty: require.resolve('tty-browserify'),
        zlib: require.resolve('browserify-zlib'),
      })
    );
    if (env.storybookWeb) {
      config.module.rules.delete('html');
      config.module
        .rule('html')
        .test(/\.html/)
        .type('asset/source');
      config.module.rules.delete('bundle');
      console.log(Object.keys(config.module.rules.entries()));
      config.plugins.delete('ContextExclusionPlugin|App_Resources');
      config.plugins.delete('ContextExclusionPlugin|Other_Platforms');
      config.plugins.delete('DefinePlugin');
      config.plugins.delete('WatchStatePlugin');
    }
  });

  // Example if you need to share images across demo apps:
  // webpack.Utils.addCopyRule({
  //   from: '../../../tools/images',
  // 	to: 'images',
  //   context: webpack.Utils.project.getProjectFilePath('node_modules')
  // });

  return webpack.resolveConfig();
};
