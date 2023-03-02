/**
 * NativeScript Polyfills
 */

// Install @nativescript/core polyfills (XHR, setTimeout, requestAnimationFrame)
import '@nativescript/core/globals';
// Install @nativescript/angular specific polyfills
import '@nativescript/angular/polyfills';

/**
 * Zone.js and patches
 */
// Add pre-zone.js patches needed for the NativeScript platform
import '@nativescript/zone-js/dist/pre-zone-polyfills';

// Zone JS is required by default for Angular itself
import 'zone.js';

// Add NativeScript specific Zone JS patches
import '@nativescript/zone-js';

import { AppHostView, APP_ROOT_VIEW, NativeScriptModule, platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import '@angular/compiler';

import { Application, GridLayout } from '@nativescript/core';
import { BehaviorSubject } from 'rxjs';
import { getCurrentStory, onStoryChange } from '../manager';
import { ICollection, Parameters, StoryFnAngularReturnType } from './types';
import { storiesMeta } from '../storyDiscovery';
import { getApplication } from './StorybookModule';
import { NgModule } from '@angular/core';

class StorybookRender {
  storyId: string;

  generateTargetSelectorFromStoryId() {
    const invalidHtmlTag = /[^A-Za-z0-9-]/g;
    const storyIdIsInvalidHtmlTagName = invalidHtmlTag.test(this.storyId);
    return storyIdIsInvalidHtmlTagName ? `sb-${this.storyId.replace(invalidHtmlTag, '')}-component` : this.storyId;
  }

  async render({ storyFnAngular, forced, parameters, component, targetDOMNode }: { storyFnAngular: StoryFnAngularReturnType; forced?: boolean; component?: any; parameters: Parameters; targetDOMNode?: HTMLElement }) {
    const targetSelector = `${this.generateTargetSelectorFromStoryId()}`;
    console.log('targetSelector:', targetSelector);
    const application = getApplication({
      storyFnAngular,
      component,
      targetSelector,
    });

    // const newStoryProps$ = new BehaviorSubject<ICollection>(storyFnAngular.props!);
    // const moduleMetadata = getStorybookModuleMetadata({ storyFnAngular, component, targetSelector }, newStoryProps$);

    //   if (
    //     !this.fullRendererRequired({
    //       storyFnAngular,
    //       moduleMetadata,
    //       forced,
    //     })
    //   ) {
    //     this.storyProps$.next(storyFnAngular.props);

    //     return;
    //   }
    //   await this.beforeFullRender();

    //   // Complete last BehaviorSubject and set a new one for the current module
    //   if (this.storyProps$) {
    //     this.storyProps$.complete();
    //   }
    //   this.storyProps$ = newStoryProps$;

    // this.initAngularRootElement(targetDOMNode, targetSelector);

    @NgModule({
      imports: [NativeScriptModule],
      bootstrap: [<any>application],
    })
    class StorybookModule {}

    try {
      const module = await platformNativeScript().bootstrapModule(StorybookModule);
      const view = module.injector.get(APP_ROOT_VIEW);
      const newRoot = view instanceof AppHostView ? view.content : view;
      Application.resetRootView({
        create() {
          return newRoot;
        },
      });
    } catch (err) {
      console.log(err);
    }

    // if (!storiesMeta.has(this.storyId)) {
    //     console.warn('failed to switch story, story metadata not found?');
    //     return;
    //   }
    //   const meta = storiesMeta.get('itemscomponent--primary');//storyId);

    //   console.log('meta:', meta);
    //   this.currentComponent = {
    //     id: meta.id,
    //     component: meta.component,
    //     args: {
    //       ...meta.args,
    //       ...args,
    //     },
    //   };
    //   await this.afterFullRender();
  }
}

const sbRender = new StorybookRender();

function renderChange(newStory = getCurrentStory()) {
  if (newStory) {
    const { storyId, args } = newStory;
    sbRender.storyId = storyId;
    const meta = storiesMeta.get(storyId);

    const parameters = {
      ...meta.args,
      ...args,
    };
    sbRender.render({
      storyFnAngular: {},
      component: meta?.component,
      parameters,
    });
  } else {
    storiesMeta.forEach((v, k) => {
      console.log('key:', k);
      console.log(v);
    });
    console.log('size:', storiesMeta.size);
    sbRender.storyId = 'itemscomponent--primary';
    const meta = storiesMeta.get('itemscomponent--primary'); //storyId);

    console.log('meta.component:', meta.component);
    sbRender.render({
      storyFnAngular: {},
      component: meta?.component,
      parameters: meta?.args,
    });
  }
}
Application.on(Application.launchEvent, (args) => {
  args.root = null;

  renderChange();
  onStoryChange(renderChange);
});

Application.run();
