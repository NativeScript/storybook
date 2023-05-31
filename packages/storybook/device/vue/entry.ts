/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import Vue from 'nativescript-vue';
import { WebSocket } from '@valor/nativescript-websockets/websocket';
import { storiesMeta } from '../storyDiscovery';

declare const NSC_STORYBOOK_WS_ADDRESS: string;

const apiWebsocket = new WebSocket(`${NSC_STORYBOOK_WS_ADDRESS}/device`);

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
  template: `
    <GridLayout rows="auto, *">
      <Label text="Storybook entry!"/>
      <GridLayout row="1" backgroundColor="#fefefe" padding="16">
        <ContentView horizontalAlignment="left" verticalAlignment="top">
          <component v-if="currentComponent" :is="currentComponent.component" v-bind="currentComponent.args" :key="currentComponent.id" />
        </ContentView>
      </GridLayout>
    </GridLayout>
  `,
}).$start();
