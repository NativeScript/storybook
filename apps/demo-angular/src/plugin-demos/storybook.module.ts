import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { StorybookComponent } from './storybook.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: StorybookComponent }])],
  declarations: [StorybookComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class StorybookModule {}
