import { Component, NgZone } from '@angular/core';
import { DemoSharedStorybookDevice } from '@demo/shared';
import {} from '@nativescript/storybook-device';

@Component({
  selector: 'demo-storybook-device',
  templateUrl: 'storybook-device.component.html',
})
export class StorybookDeviceComponent {
  demoShared: DemoSharedStorybookDevice;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedStorybookDevice();
  }
}
