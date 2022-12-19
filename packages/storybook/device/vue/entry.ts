/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Vue from 'nativescript-vue';
import { getCurrentStory, onStoryChange } from '../manager';
import { storiesMeta } from '../storyDiscovery';

new Vue({
  data: {
    story: getCurrentStory(),
    currentComponent: null,
  },
  created() {
    onStoryChange((story: any) => {
      this.story = story;
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
      const meta = storiesMeta.get(storyId);

      this.currentComponent = {
        id: meta.id,
        component: meta.component,
        args: {
          ...meta.args,
          ...args,
        },
      };
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
