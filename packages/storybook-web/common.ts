import { Observable } from '@nativescript/core';
import { Meta, Story } from '@storybook/angular';
import { listenToStoryChange } from './utils';

export class StorybookWebCommon extends Observable {
  public static initialized = false;

  public static init(platform: 'ios' | 'android'): void {
    if (!this.initialized) {
      this.initialized = true;
      listenToStoryChange(platform);
    }
  }
}

export interface NSMeta extends Meta {}
export interface NSStory extends Story {}
