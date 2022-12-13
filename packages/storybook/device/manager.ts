/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentStory } from './currentStory';

if (module.hot) {
  module.hot.accept('./current.js', () => {
    _cb?.(currentStory.story);
  });
}

let _cb: any;
export const onStoryChange = (cb: any) => {
  _cb = cb;
};

export function getCurrentStory() {
  return currentStory.story;
}
