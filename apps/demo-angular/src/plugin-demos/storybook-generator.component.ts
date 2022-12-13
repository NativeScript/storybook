import { Component, NgZone } from '@angular/core';
import { DemoSharedStorybookGenerator } from '@demo/shared';
import {} from '@nativescript/storybook-generator';

@Component({
  selector: 'demo-storybook-generator',
  templateUrl: 'storybook-generator.component.html',
})
export class StorybookGeneratorComponent {
  demoShared: DemoSharedStorybookGenerator;

  constructor(private _ngZone: NgZone) {}

  ngOnInit() {
    this.demoShared = new DemoSharedStorybookGenerator();
  }
}
