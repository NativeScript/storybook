import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedStorybook } from '@demo/shared';
import {} from '@nativescript/storybook';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedStorybook {}
