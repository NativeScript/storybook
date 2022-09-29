import { AndroidApplication, Application } from '@nativescript/core';
import { StorybookDeviceCommon } from './common';
import { UrlUtil } from './utils/url.util';

export class StorybookDevice extends StorybookDeviceCommon {
  public static init(): void {
    Application.android.on(AndroidApplication.activityNewIntentEvent, (args) => {
      setTimeout(() => {
        let intent: android.content.Intent = args.activity.getIntent();
        try {
          const parsedUrl = UrlUtil.getInstance().handleAndroidIntent(intent);
          UrlUtil.getInstance().getCallback()(parsedUrl);
        } catch (e) {
          console.error('Unknown error during getting App URL data', e);
        }
      });
    });
  }
}
