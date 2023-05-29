import { NgModule, PlatformRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Subject, BehaviorSubject } from 'rxjs';
import { stringify } from 'telejson';
import { ICollection, StoryFnAngularReturnType, Parameters } from './types';
import { createStorybookModule, getStorybookModuleMetadata } from './StorybookModule';

type StoryRenderInfo = {
  storyFnAngular: StoryFnAngularReturnType;
  moduleMetadataSnapshot: string;
};

// platform must be init only if render is called at least once
let platformRef: PlatformRef;
function getPlatform(newPlatform?: boolean): PlatformRef {
  if (!platformRef || newPlatform) {
    platformRef = platformBrowserDynamic();
  }
  return platformRef;
}

export abstract class AbstractRenderer {
  /**
   * Wait and destroy the platform
   */
  public static resetPlatformBrowserDynamic() {
    return new Promise<void>((resolve) => {
      if (platformRef && !platformRef.destroyed) {
        platformRef.onDestroy(async () => {
          resolve();
        });
        // Destroys the current Angular platform and all Angular applications on the page.
        // So call each angular ngOnDestroy and avoid memory leaks
        platformRef.destroy();
        return;
      }
      resolve();
    }).then(() => {
      getPlatform(true);
    });
  }

  /**
   * Reset compiled components because we often want to compile the same component with
   * more than one NgModule.
   */
  protected static resetCompiledComponents = async () => {
    try {
      // Clear global Angular component cache in order to be able to re-render the same component across multiple stories
      //
      // References:
      // https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/build_angular/src/webpack/plugins/hmr/hmr-accept.ts#L50
      // https://github.com/angular/angular/blob/2ebe2bcb2fe19bf672316b05f15241fd7fd40803/packages/core/src/render3/jit/module.ts#L377-L384
      const { ɵresetCompiledComponents } = await import('@angular/core');
      ɵresetCompiledComponents();
    } catch (e) {
      /**
       * noop catch
       * This means angular removed or modified ɵresetCompiledComponents
       */
    }
  };

  protected previousStoryRenderInfo: StoryRenderInfo;

  // Observable to change the properties dynamically without reloading angular module&component
  protected storyProps$: Subject<ICollection | undefined>;

  constructor(public storyId: string) {
    if (typeof NODE_ENV === 'string' && NODE_ENV !== 'development') {
      try {
        // platform should be set after enableProdMode()
        enableProdMode();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.debug(e);
      }
    }
  }

  protected abstract beforeFullRender(): Promise<void>;

  protected abstract afterFullRender(): Promise<void>;

  /**
   * Bootstrap main angular module with main component or send only new `props` with storyProps$
   *
   * @param storyFnAngular {StoryFnAngularReturnType}
   * @param forced {boolean} If :
   * - true render will only use the StoryFn `props' in storyProps observable that will update sotry's component/template properties. Improves performance without reloading the whole module&component if props changes
   * - false fully recharges or initializes angular module & component
   * @param component {Component}
   * @param parameters {Parameters}
   */
  public async render({ storyFnAngular, forced, parameters, component, targetDOMNode }: { storyFnAngular: StoryFnAngularReturnType; forced: boolean; component?: any; parameters: Parameters; targetDOMNode: HTMLElement }) {
    const targetSelector = `${this.generateTargetSelectorFromStoryId()}`;

    const newStoryProps$ = new BehaviorSubject<ICollection>(storyFnAngular.props);
    const moduleMetadata = getStorybookModuleMetadata({ storyFnAngular, component, targetSelector }, newStoryProps$);

    if (
      !this.fullRendererRequired({
        storyFnAngular,
        moduleMetadata,
        forced,
      })
    ) {
      this.storyProps$.next(storyFnAngular.props);

      return;
    }
    await this.beforeFullRender();

    // Complete last BehaviorSubject and set a new one for the current module
    if (this.storyProps$) {
      this.storyProps$.complete();
    }
    this.storyProps$ = newStoryProps$;

    this.initAngularRootElement(targetDOMNode, targetSelector);

    await getPlatform().bootstrapModule(createStorybookModule(moduleMetadata), parameters.bootstrapModuleOptions ?? undefined);
    await this.afterFullRender();
  }

  /**
   * Only ASCII alphanumerics can be used as HTML tag name.
   * https://html.spec.whatwg.org/#elements-2
   *
   * Therefore, stories break when non-ASCII alphanumerics are included in target selector.
   * https://github.com/storybookjs/storybook/issues/15147
   *
   * This method returns storyId when it doesn't contain any non-ASCII alphanumerics.
   * Otherwise, it generates a valid HTML tag name from storyId by removing non-ASCII alphanumerics from storyId, prefixing "sb-", and suffixing "-component"
   * @protected
   * @memberof AbstractRenderer
   */
  protected generateTargetSelectorFromStoryId() {
    const invalidHtmlTag = /[^A-Za-z0-9-]/g;
    const storyIdIsInvalidHtmlTagName = invalidHtmlTag.test(this.storyId);
    return storyIdIsInvalidHtmlTagName ? `sb-${this.storyId.replace(invalidHtmlTag, '')}-component` : this.storyId;
  }

  protected initAngularRootElement(targetDOMNode: HTMLElement, targetSelector: string) {
    // Adds DOM element that angular will use as bootstrap component
    // eslint-disable-next-line no-param-reassign
    targetDOMNode.innerHTML = '';
    targetDOMNode.appendChild(document.createElement(targetSelector));
  }

  private fullRendererRequired({ storyFnAngular, moduleMetadata, forced }: { storyFnAngular: StoryFnAngularReturnType; moduleMetadata: NgModule; forced: boolean }) {
    const { previousStoryRenderInfo } = this;

    const currentStoryRender = {
      storyFnAngular,
      moduleMetadataSnapshot: stringify(moduleMetadata),
    };

    this.previousStoryRenderInfo = currentStoryRender;

    if (
      // check `forceRender` of story RenderContext
      !forced ||
      // if it's the first rendering and storyProps$ is not init
      !this.storyProps$
    ) {
      return true;
    }

    // force the rendering if the template has changed
    const hasChangedTemplate = !!storyFnAngular?.template && previousStoryRenderInfo?.storyFnAngular?.template !== storyFnAngular.template;
    if (hasChangedTemplate) {
      return true;
    }

    // force the rendering if the metadata structure has changed
    const hasChangedModuleMetadata = currentStoryRender.moduleMetadataSnapshot !== previousStoryRenderInfo?.moduleMetadataSnapshot;

    return hasChangedModuleMetadata;
  }
}
