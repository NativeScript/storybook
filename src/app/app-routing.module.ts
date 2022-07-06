import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { PreviewComponent } from './preview/preview.component'

const routes: Routes = [
  { path: '', redirectTo: '/preview', pathMatch: 'full' },
  { path: 'preview', component: PreviewComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
