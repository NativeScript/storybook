import { Component, NgZone } from '@angular/core';
import { DemoSharedStorybookWeb } from '@demo/shared';
import {} from '@nativescript/storybook-web';

@Component({
  selector: 'demo-storybook-web',
  templateUrl: 'storybook-web.component.html',
})
export class StorybookWebComponent {
  demoShared: DemoSharedStorybookWeb;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedStorybookWeb();
  }
}
