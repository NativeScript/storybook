import {
    platformNativeScript,
    runNativeScriptAngularApp
} from "@nativescript/angular";
import {
    AndroidApplication,
    Application,
    isAndroid,
    isIOS
} from "@nativescript/core";

import { AppModule } from "./app/app.module";

import { UrlHandlerService } from "./app/services/url-handler.service";

if (isIOS) {
    @NativeClass()
    class UIApplicationDelegateImpl
        extends UIResponder
        implements UIApplicationDelegate
    {
        public static ObjCProtocols = [UIApplicationDelegate];
    }
    Application.ios.delegate = UIApplicationDelegateImpl;

    const appDelegate = Application.ios.delegate;

    function enableMultipleOverridesFor(
        classRef,
        methodName,
        nextImplementation
    ) {
        const currentImplementation = classRef.prototype[methodName];
        classRef.prototype[methodName] = function () {
            const result =
                currentImplementation &&
                currentImplementation.apply(
                    currentImplementation,
                    Array.from(arguments)
                );
            return nextImplementation.apply(
                nextImplementation,
                Array.from(arguments).concat([result])
            );
        };
    }

    enableMultipleOverridesFor(
        appDelegate,
        "applicationOpenURLOptions",
        function (
            application: UIApplication,
            url: NSURL,
            options: any
        ): boolean {
            const lastArgument = arguments[arguments.length - 1];
            const previousResult =
                lastArgument !== options ? lastArgument : undefined;

            if (!previousResult) {
                const parsedUrl = UrlHandlerService.getInstance().parseUrl(
                    url.absoluteString
                );
                UrlHandlerService.getInstance().getCallback()(parsedUrl);
                return true;
            }

            return previousResult;
        }
    );
}
if (isAndroid) {
    Application.android.on(
        AndroidApplication.activityNewIntentEvent,
        (args) => {
            setTimeout(() => {
                let intent: android.content.Intent = args.activity.getIntent();
                try {
                    const parsedUrl =
                        UrlHandlerService.getInstance().handleAndroidIntent(
                            intent
                        );
                    UrlHandlerService.getInstance().getCallback()(parsedUrl);
                } catch (e) {
                    console.error(
                        "Unknown error during getting App URL data",
                        e
                    );
                }
            });
        }
    );
}

runNativeScriptAngularApp({
    appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule)
});
