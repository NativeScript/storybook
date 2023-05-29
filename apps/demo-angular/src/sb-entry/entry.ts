import '../polyfills';
import '@angular/compiler';

import { AppHostView, APP_ROOT_VIEW, NativeScriptModule, platformNativeScript, runNativeScriptAngularApp, bootstrapApplication } from '@nativescript/angular';
import '@angular/compiler';

import { Application, GridLayout, ProxyViewContainer } from '@nativescript/core';
import { BehaviorSubject, Subject } from 'rxjs';
// import { getCurrentStory, onStoryChange } from '../manager';
import { ICollection, Parameters, StoryFnAngularReturnType } from './types';
// import { storiesMeta } from '../storyDiscovery';
import { getApplication } from './StorybookModule';
import { NgModule } from '@angular/core';
import { STORY_PROPS } from './StorybookProvider';

import { toId } from '@storybook/csf';

function getCurrentStory() {
  return null;
}

// todo: handle differnt patterns, this is hard-coded right now and ignores the user storybook config...
const storiesCtx = require.context('storybook-src/', true, /\.stories\.(js|ts)$/);

export const storiesMeta = new Map();

storiesCtx.keys().forEach((key: string) => {
  console.log('[Storybook] Discovered:', key);
  const data = storiesCtx(key);
  const storyMeta = data.default;
  const exports = Object.keys(data).filter((name) => name !== 'default');

  const storiesInFile: any = exports.map((name: string) => {
    return {
      id: toId(storyMeta.title, name),
      name,
    };
  });

  storiesInFile.forEach((story: any) => {
    storiesMeta.set(story.id, {
      id: story.id,
      meta: storyMeta,
      component: storyMeta.component,
      args: data[story.name].args,
      factory: data[story.name],
    });
  });
});

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

    try {
      const module = await bootstrapApplication(application, {
        providers: [{ provide: STORY_PROPS, useValue: new Subject() }],
      });
      const view = module.injector.get(APP_ROOT_VIEW);
      let newRoot = view instanceof AppHostView ? view.content : view;
      while (newRoot instanceof ProxyViewContainer) {
        newRoot = newRoot.getChildAt(0);
      }
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
  console.log('----story', newStory);
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
    sbRender.storyId = 'example-card--primary';
    const meta = storiesMeta.get('example-card--primary'); //storyId);

    console.log('meta.component:', meta?.component);
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
  // onStoryChange(renderChange);
});

Application.run();
