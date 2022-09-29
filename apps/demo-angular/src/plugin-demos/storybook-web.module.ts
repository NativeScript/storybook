import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { StorybookWebComponent } from './storybook-web.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: StorybookWebComponent }])],
  declarations: [StorybookWebComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class StorybookWebModule {}
