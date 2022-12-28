/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentStory } from './currentStory';

if (module.hot) {
  module.hot.accept('./currentStory', () => {
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
