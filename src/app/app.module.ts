import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PreviewComponent } from './preview/preview.component'
import { ComponentsModule } from './components/components.module';
import { ImageCacheItModule } from '@triniwiz/nativescript-image-cache-it/angular';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, ImageCacheItModule, ComponentsModule],
  declarations: [AppComponent, PreviewComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
