import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedStorybookDevice } from '@demo/shared';
import {} from '@nativescript/storybook-device';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedStorybookDevice {}
