import { addons } from '@storybook/preview-api';
import { DOCS_RENDERED, STORY_CHANGED } from '@storybook/core-events';
import { AbstractRenderer } from './AbstractRenderer';
import { StoryFnAngularReturnType, Parameters } from './types';

export class DocsRenderer extends AbstractRenderer {
  public async render(options: { storyFnAngular: StoryFnAngularReturnType; forced: boolean; component: any; parameters: Parameters; targetDOMNode: HTMLElement }) {
    const channel = addons.getChannel();
    /**
     * Destroy and recreate the PlatformBrowserDynamic of angular
     * For several stories to be rendered in the same docs we should
     * not destroy angular between each rendering but do it when the
     * rendered stories are not needed anymore.
     *
     * Note for improvement: currently there is one event per story
     * rendered in the doc. But one event could be enough for the whole docs
     *
     */
    channel.once(STORY_CHANGED, async () => {
      await DocsRenderer.resetPlatformBrowserDynamic();
    });

    /**
     * Destroy and recreate the PlatformBrowserDynamic of angular
     * when doc re render. Allows to call ngOnDestroy of angular
     * for previous component
     */
    channel.once(DOCS_RENDERED, async () => {
      await DocsRenderer.resetPlatformBrowserDynamic();
    });

    await super.render({ ...options, forced: false });
  }

  async beforeFullRender(): Promise<void> {}

  async afterFullRender(): Promise<void> {
    await AbstractRenderer.resetCompiledComponents();
  }
}
