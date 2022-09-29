import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { StorybookDeviceComponent } from './storybook-device.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: StorybookDeviceComponent }])],
  declarations: [StorybookDeviceComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class StorybookDeviceModule {}
