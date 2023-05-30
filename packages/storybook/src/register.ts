/* eslint-disable @typescript-eslint/no-explicit-any */
import { addons, types } from '@storybook/addons';
import { useStorybookApi } from '@storybook/manager-api';
import { normalizeInputTypes } from './normalizeInputTypes';
import { API_LeafEntry, API_StoryEntry } from '@storybook/types';
import { StoryChangeEvent, isStoryArgsUpdateEvent, isStoryUpdateEvent } from './types';

type API = ReturnType<typeof useStorybookApi>;

function parseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function getStoryEntry(data: API_LeafEntry) {
  if (data?.type === 'story') {
    return data as API_StoryEntry;
  }
  return null;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number, immediate = false): (...args: any[]) => void {
  let timeout: any;
  return function (...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

const updateStoryArgs = debounce((fn: () => void) => {
  fn();
}, 100);

addons.register('NATIVESCRIPT', () => {
  let isListening = false;

  addons.add('STORYCHANGELISTENER', {
    title: 'STORYCHANGELISTENER',
    type: types.TOOLEXTRA,
    render() {
      const api = useStorybookApi();
      (window as any).__TEST_SB_API__ = api;

      // const [args] = useArgs()
      // console.log(args);
      if (!isListening) {
        listenToStoryChange();
        isListening = true;
      }

      return null as any;
    },
  });
});

function listenToStoryChange() {
  const api = useStorybookApi();
  const socket = new WebSocket('ws://localhost:8080/preview');
  socket.onmessage = (event) => {
    const wsData = parseJson(event.data);
    if (!wsData) {
      return;
    }
    if (isStoryUpdateEvent(wsData)) {
      api.updateStory(wsData.storyId, {
        argTypes: normalizeInputTypes(wsData.argTypes),
        initialArgs: wsData.initialArgs,
        args: wsData.args,
        parameters: {
          controls: { hideNoControlsWarning: true },
        },
      });
    } else if (isStoryArgsUpdateEvent(wsData)) {
      const data = getStoryEntry(api.getData(wsData.storyId));
      if (data) {
        api.updateStoryArgs(data, wsData.storyUpdate);
      }
    }
  };
  addons.ready().then((channel) => {
    let currentStory: any = null;
    console.log(getStoryEntry(api.getCurrentStoryData()));

    if (window.location.search.includes('/story/')) {
      const checkStory = () => {
        console.log('checking story...');
        const story = api.getCurrentStoryData();
        if (story && !currentStory) {
          currentStory = story;
          console.log('found story', currentStory);
          socket.send(
            JSON.stringify(<StoryChangeEvent>{
              kind: 'storyChange',
              force: true,
              story: {
                storyId: currentStory.id,
              },
            })
          );

          api.updateStory(currentStory.id, {
            parameters: {
              controls: { hideNoControlsWarning: true },
            },
          });
          return;
        }

        setTimeout(checkStory, 100);
      };

      checkStory();
    }

    channel.addListener('setCurrentStory', (story) => {
      // console.log("setCurrentStory", story);
      currentStory = story;
      socket.send(
        JSON.stringify(<StoryChangeEvent>{
          kind: 'storyChange',
          story: currentStory,
        })
      );

      api.updateStory(currentStory.storyId, {
        parameters: {
          controls: { hideNoControlsWarning: true },
        },
      });

      // const t = normalizeInputTypes({
      //   title: { control: 'text' },
      //   titleColor: { control: 'color' },
      //   content: { control: 'text' },
      //   contentColor: { control: 'color' },
      //   borderRadius: { control: { type: 'range', min: 0, max: 30, step: 1 } },
      //   imageBorderRadius: { control: { type: 'range', min: 0, max: 30, step: 1 } },
      //   boxShadow: { control: 'text' },
      //   imageSrc: { control: 'text' },
      // });
      // console.log(api.getData())
      // console.log(t);

      // // passing an empty object updates the current story!
      // api.updateStoryArgs({} as any, {
      //   title: 'Hello',
      // });
    });

    channel.addListener('updateStoryArgs', (storyArgs) => {
      console.log('updateStoryArgs', storyArgs);
      const api: API = (window as any).__TEST_SB_API__;

      const currentStoryData = getStoryEntry(api.getCurrentStoryData());
      if (currentStoryData) {
        const updatedArgs = {
          ...currentStoryData.args,
          ...storyArgs.updatedArgs,
        };
        currentStory.args = updatedArgs;

        updateStoryArgs(() => {
          // persist args
          api.updateStory(currentStoryData.id, {
            args: updatedArgs,
            argTypes: currentStoryData.argTypes,
            initialArgs: currentStoryData.initialArgs,
          });

          socket.send(
            JSON.stringify(<StoryChangeEvent>{
              kind: 'storyChange',
              story: {
                storyId: currentStoryData.id,
                args: updatedArgs,
              },
            })
          );
        });
      }
    });
  });
}
