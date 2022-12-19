import { toId } from '@storybook/csf';

// todo: handle differnt patterns, this is hard-coded right now and ignores the user storybook config...
const storiesCtx = require.context('@/', true, /\.stories\.(js|ts)$/);

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
      component: storyMeta.component,
      args: data[story.name].args,
    });
  });
});
