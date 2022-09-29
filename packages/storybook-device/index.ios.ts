import { Application } from '@nativescript/core';
import { StorybookDeviceCommon } from './common';
import { UrlUtil } from './utils/url.util';

export class StorybookDevice extends StorybookDeviceCommon {
  public static init(): void {
    console.log('-init-');
    @NativeClass()
    class UIApplicationDelegateImpl extends UIResponder implements UIApplicationDelegate {
      public static ObjCProtocols = [UIApplicationDelegate];
    }
    Application.ios.delegate = UIApplicationDelegateImpl;

    const appDelegate = Application.ios.delegate;

    function enableMultipleOverridesFor(classRef, methodName, nextImplementation) {
      const currentImplementation = classRef.prototype[methodName];
      classRef.prototype[methodName] = function () {
        const result = currentImplementation && currentImplementation.apply(currentImplementation, Array.from(arguments));
        return nextImplementation.apply(nextImplementation, Array.from(arguments).concat([result]));
      };
    }

    enableMultipleOverridesFor(appDelegate, 'applicationOpenURLOptions', function (application: UIApplication, url: NSURL, options: any): boolean {
      const lastArgument = arguments[arguments.length - 1];
      const previousResult = lastArgument !== options ? lastArgument : undefined;

      if (!previousResult) {
        const parsedUrl = UrlUtil.getInstance().parseUrl(url.absoluteString);
        UrlUtil.getInstance().getCallback()(parsedUrl);
        return true;
      }

      return previousResult;
    });
  }
}
