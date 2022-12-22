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

      this.currentComponent = {
        id: story.id,
        component,
        args: _args,
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
