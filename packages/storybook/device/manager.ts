/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentStory } from './currentStory';

if (module.hot) {
  console.log('hmr module.hot:', module.hot);
  module.hot.accept('./currentStory', () => {
    console.log('currentstory change!', currentStory);
    _cb?.(currentStory);
  });
}

let _cb: any;
export const onStoryChange = (cb: any) => {
  _cb = cb;
};

export function getCurrentStory(): any {
  return currentStory;
}
