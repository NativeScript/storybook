const { IgnorePlugin } = require('webpack');
const { resolve } = require('path');

import type NSWebpack from '@nativescript/webpack';
module.exports = (webpack: typeof NSWebpack) => {
  // todo: have a default entry that notes the selected flavor is unsupported or something
  let sbEntryPath = '';

  const flavorName = 'angular'; //webpack.Utils.flavor.determineProjectFlavor();

  if (flavorName && ['vue', 'angular'].includes(flavorName)) {
    // supported flavor, resolve entry path...
    sbEntryPath = resolve(__dirname, `./device/${flavorName}/entry`);
  }

  webpack.chainWebpack((config, env) => {
    /* prettier-ignore */
    if (env.storybook) {
      config
        .entry("bundle")
        .clear()
        .add("@nativescript/core/globals/index.js")
        .add("@nativescript/core/bundle-entry-points")
        .add(sbEntryPath);

      // config.module.rule("bundle").test(webpack.Utils.project.getProjectFilePath(sbEntryPath));

      // allows triggering HMR from within node_modules where our custom entry is located at.
      config.set('snapshot', {
        managedPaths: [],
      });

      if (webpack.Utils.platform.getPlatformName() === "android") {
        config
          .entry("bundle")
          .add("@nativescript/core/ui/frame")
          .add("@nativescript/core/ui/frame/activity");
      }
    } else {
      // config.plugin("IgnorePlugin|storybook").use(IgnorePlugin, [
      //   {
      //     checkResource: (resource, context) => {
      //       if (context === webpack.Utils.platform.getEntryDirPath()) {
      //         if (/\.stories\.(ts|js)$/.test(resource)) {
      //           return true;
      //         }
      //       }
      //       return false;
      //     },
      //   },
      // ]);
    }
  });
};
