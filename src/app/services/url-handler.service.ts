import { AndroidApplication, Application } from "@nativescript/core";

export interface StorybookUrl {
    url: string,
    params?: Record<string, any>
}
export class UrlHandlerService {
     
    // used by iOS
    parseUrl(url: string): StorybookUrl {
        if (!url) {
            return {
                url: ''
            }
        }
        // example url: sb-native://deep.link?component=button&label=helo
        const urlWithParams = url.indexOf('?') !== -1
        if (urlWithParams) {
            const params = {};
            const parameters = url.substring(url.indexOf('?') + 1).split('&');
            parameters.forEach(parameter => {
                const [parameterKey, parameterValue] = parameter.split('=');
                params[parameterKey] = decodeURI(parameterValue);
            })
            return {
                url: url,
                params: params
            }
        }
        return {
            url: url
        }
    }

    // used by Android
    handleAndroidIntent(intent: android.content.Intent): StorybookUrl {
        let data = intent.getData();
        try {
            const appUrl = this.parseUrl(data?.toString());
            if (appUrl != null &&
                (new String(intent.getAction()).valueOf() === new String(android.content.Intent.ACTION_MAIN).valueOf()
                    || new String(intent.getAction()).valueOf() === new String(android.content.Intent.ACTION_VIEW).valueOf())) {
                try {
                      // clear intent so that url will not be re-handled upon subsequent ActivityStarted event
                      intent.setAction('');
                      intent.setData(null);
                      return appUrl;
                } catch (error) {
                    console.log('error', error);
                }
            }
        } catch (e) {
            console.error('Unknown error during getting App URL data', e);
        }
    }

    private urlHandlerCallback;
    handleOpenURL(handler: (url: StorybookUrl) => void): void {
        this.urlHandlerCallback = handler;
    }
    
    getCallback(): (url: StorybookUrl) => void {
        if (!this.urlHandlerCallback) {
            this.urlHandlerCallback = function () {
                console.error('No callback provided. Please ensure that you called "handleOpenURL" during application init!');
            };
        }
        return this.urlHandlerCallback;
    }

    private static _instance: UrlHandlerService = new UrlHandlerService()
    static getInstance(): UrlHandlerService {
        return UrlHandlerService._instance
    }
}