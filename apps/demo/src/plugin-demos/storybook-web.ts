import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedStorybookWeb } from '@demo/shared';
import {} from '@nativescript/storybook-web';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedStorybookWeb {}
