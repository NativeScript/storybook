import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home.component';
import { CardComponent } from './example-stories/card.component';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [AppComponent, HomeComponent, CardComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
})
export class AppModule {}
