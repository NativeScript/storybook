import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from "rxjs";
import { addons } from "@storybook/addons";
import { ControllerManager } from "@storybook/native-controllers";

export function listenToStoryChange(targetPlatform: 'android' | 'ios'): void {
  addons.ready().then(channel => {
    setTimeout(() => {
      const queryParams$ = new BehaviorSubject<Record<string, any>>({});
      const component$ = new BehaviorSubject<string>('');

      combineLatest([
        component$.pipe(distinctUntilChanged()),
        queryParams$.pipe(distinctUntilChanged())
      ]).pipe(
        debounceTime(200)
      )
      .subscribe(([component, queryParams]) => {
        console.groupCollapsed('Component update');
        console.log('component', component);
        console.log('queryParams', queryParams);
        console.groupEnd();
        const componentName = component?.split('--')[0] || '';
        updateDeepLink(componentName, queryParams, targetPlatform);
      })

      const defaultStoryId = (<any>channel).data?.storyRendered?.[0];
      const storiesConfig = (<any>channel).data?.setStories?.[0].stories;
      component$.next(defaultStoryId ||'');
      queryParams$.next({ args: (<any>channel).data?.storyArgsUpdated?.[0]?.args || storiesConfig?.[defaultStoryId]?.args || {}})

      channel.addListener('updateStoryArgs', (storyArgs) => {
          queryParams$.next({args: {
            ...queryParams$.getValue().args,
            ...storyArgs.updatedArgs
          }
        });
      })
      channel.addListener('setCurrentStory', (story) => {
          queryParams$.next({ args: storiesConfig?.[story.storyId]?.args || {}});
          component$.next(story.storyId || '');
      })
     
    })

  })
}

function updateDeepLink(component: string, storyParams: Record<string,any>, targetPlatform: 'android' | 'ios'): void {
  const manager = new ControllerManager();
  const context = targetPlatform;
  const controller = manager.getController(context);
  const deepLinkBaseUrl="sb-native://deep.link";
  controller.updateConfig({
    settings: {
        device: targetPlatform
    },
    platform: targetPlatform,
    baseUrl: deepLinkBaseUrl
  });
  if (storyParams?.args){ 
    const storyParamsWithExtras = { 
      component: component,
      args: storyParams.args
     };
     const newAppUrl = getFullDeepLinkUrl(
       deepLinkBaseUrl,
       storyParamsWithExtras
    );
    console.groupCollapsed('Generating deeplink');
    console.log('newAppUrl', newAppUrl);
    console.log('storyParamsWithExtras', storyParamsWithExtras);
    console.groupEnd();
    controller.openDeepLink(newAppUrl);
    return;
  } else {
      const newAppUrl = getFullDeepLinkUrl(
        deepLinkBaseUrl,
        {
          component: component
        }
    );
    console.groupCollapsed('Generating deeplink');
    console.log('newAppUrl', newAppUrl);
    console.groupEnd();
    controller.openDeepLink(newAppUrl);
  }
}

function getFullDeepLinkUrl(baseDeepLinkUrl: string, storyParams: Record<string, any>): string {
  var qsParams = getQueryString(storyParams);
  return baseDeepLinkUrl + "?" + qsParams;
}

function getQueryString(data: Record<string, any>): string {
  return Object.keys(data)
        .map((key) => {
          if (typeof data[key] === 'object') {
            const subData = Object.keys(data[key]).map(subKey => {
              return encodeURIComponent(subKey) + ":" + encodeURIComponent(data[key][subKey])
            }).join(';')
            return encodeURIComponent(key) + "=" + subData;
          } else {
            return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
          }
    }).join("&");
}