import { Component, NgZone } from '@angular/core';
import { DemoSharedStorybook } from '@demo/shared';
import {} from '@nativescript/storybook';

@Component({
  selector: 'demo-storybook',
  templateUrl: 'storybook.component.html',
})
export class StorybookComponent {
  demoShared: DemoSharedStorybook;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedStorybook();
  }
}
