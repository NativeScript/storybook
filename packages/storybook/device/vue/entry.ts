/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Color, Label, View } from '@nativescript/core';
import { WebSocket } from '@valor/nativescript-websockets/websocket';
import Vue from 'nativescript-vue';
import { storiesMeta } from '../storyDiscovery';

declare const NSC_STORYBOOK_WS_ADDRESS: string;

// replaced by webpack DefinePlugin.
const wsAddress = NSC_STORYBOOK_WS_ADDRESS;

const apiWebsocket = new WebSocket(`${wsAddress}/device`);

const StorybookStory = Vue.extend({
  props: ['currentComponent'],
  template: `<component :is="currentComponent.component" v-bind="currentComponent.args"  />`,
  errorCaptured(err, vm, info) {
    console.log('errorCaptured', err, vm, info);

    return true;
  },
});

new Vue({
  data: {
    story: null,
    currentComponent: null,
  },
  created() {
    apiWebsocket.addEventListener('message', (event: any) => {
      const data = JSON.parse(event.data);
      // console.log('incoming', data);
      if (data.kind === 'storyChange') {
        this.$set(this, 'story', data.story);
      }
    });
  },
  watch: {
    story(newStory) {
      console.log('STORY CHANGE', newStory);
      if (!newStory) {
        return;
      }

      const { storyId, args } = newStory;
      console.log('switch to', storyId);

      if (!storiesMeta.has(storyId)) {
        console.warn('failed to switch story, story metadata not found?');
        return;
      }
      const story = storiesMeta.get(storyId);
      const _args = {
        ...story.args,
        ...args,
      };

      let component;
      if (story.factory) {
        component = story.factory(_args, story.meta);
      } else {
        component = story.component;
      }

      apiWebsocket.send(
        JSON.stringify({
          kind: 'storyUpdate',
          storyId: storyId,
          argTypes: story.meta.argTypes,
          initialArgs: story.args,
          args: _args,
        })
      );

      this.currentComponent = {
        id: story.id,
        component,
        args: _args,
      } as any;
    },
  },
  computed: {
    storyKey() {
      return this.currentComponent
        ? [this.currentComponent.id, JSON.stringify(this.currentComponent.args)].join(',')
        : null;
    },
  },
  methods: {
    createStoryView(args) {
      try {
        const vm = new StorybookStory({
          propsData: { currentComponent: this.currentComponent },
        });
        vm.$mount();
        const view: View = (vm.$el as any).nativeView;
        args.object.content = view;
      } catch (err) {
        console.error('Failed to render story:', err);
        const errorLabel = new Label();
        errorLabel.color = new Color('red');
        errorLabel.text = err.toString();
        args.object.content = errorLabel;
      }
    },
  },
  template: `
    <GridLayout rows="auto, *">
      <!-- <Label :text="storyKey" textWrap="true"/> -->
      <GridLayout row="1" backgroundColor="#fefefe" padding="16">
        <ContentView horizontalAlignment="left" verticalAlignment="top">
          <ContentView v-if="currentComponent" :key="storyKey" @loaded="createStoryView"/>
        </ContentView>
      </GridLayout>
    </GridLayout>
  `,
}).$start();
