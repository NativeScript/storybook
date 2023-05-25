import { runNativeScriptAngularApp, platformNativeScript } from '@nativescript/angular';
import { AppModule } from './app.module';

// import { StorybookDevice } from '@nativescript/storybook-device';
// StorybookDevice.init();

// this will go to the .stories file
// import { StorybookWeb } from '@nativescript/storybook-web';
// StorybookWeb.init('ios');

runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});

require('@nativescript/webpack/dist/loaders/nativescript-hot-loader/hmr.runtime');
