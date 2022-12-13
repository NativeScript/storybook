import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { StorybookGeneratorComponent } from './storybook-generator.component';

@NgModule({
  imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: StorybookGeneratorComponent }])],
  declarations: [StorybookGeneratorComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class StorybookGeneratorModule {}
