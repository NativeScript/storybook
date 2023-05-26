/* eslint-disable @typescript-eslint/no-explicit-any */
import { addons, types } from '@storybook/addons';
import { useStorybookApi } from '@storybook/manager-api';

type API = ReturnType<typeof useStorybookApi>;

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
  addons.ready().then((channel) => {
    let currentStory: any = null;

    channel.addListener('setCurrentStory', (story) => {
      // console.log("setCurrentStory", story);
      currentStory = story;
      storyChange(currentStory);

      const api: API = (window as any).__TEST_SB_API__;
      api.updateStory(currentStory.storyId, {
        // todo: get the argTypes from websocket
        argTypes: {
          textInput: {
            control: {
              type: 'text',
            },
            name: 'textInput',
            type: {
              name: 'string',
            },
          },
          textInput2: {
            control: {
              type: 'text',
            },
            name: 'textInput2',
            type: {
              name: 'string',
            },
          },
        },
        parameters: {
          controls: { hideNoControlsWarning: true },
        },
      });
    });

    channel.addListener('updateStoryArgs', (storyArgs) => {
      console.log('updateStoryArgs', storyArgs);
      const api: API = (window as any).__TEST_SB_API__;

      if (currentStory) {
        const updatedArgs = {
          ...currentStory.args,
          ...storyArgs.updatedArgs,
        };
        currentStory.args = updatedArgs;

        // persist args
        api.updateStory(currentStory.storyId, {
          args: updatedArgs,
        });

        storyChange(currentStory);
      }
    });
  });
}

const storyChange = debounce((story: any) => {
  console.log('story change', story);

  try {
    fetch('/nativescript/changeStory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(story),
    });
    // controller.openDeepLink(newAppUrl);
  } catch (err) {
    // ignore
  }
}, 500);
