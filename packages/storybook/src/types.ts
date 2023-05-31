import type { ArgTypes, Args } from '@storybook/types';

export interface StoryChangeEvent {
  kind: 'storyChange';
  story: any;
}
export interface StoryUpdateEvent {
  kind: 'storyUpdate';
  storyId: string;
  argTypes: ArgTypes<Args>;
  initialArgs?: Args;
  args?: Args;
}

export interface StoryArgsUpdateEvent {
  kind: 'storyUpdate';
  storyId: string;
  storyUpdate: Args;
}

export type PreviewEvents = StoryChangeEvent;
export type DeviceEvents = StoryUpdateEvent | StoryArgsUpdateEvent;

export function isStoryChangeEvent(event: any): event is StoryChangeEvent {
  return event.kind === 'storyChange';
}

export function isStoryUpdateEvent(event: any): event is StoryUpdateEvent {
  return event.kind === 'storyUpdate';
}

export function isStoryArgsUpdateEvent(event: any): event is StoryArgsUpdateEvent {
  return event.kind === 'storyUpdate';
}
