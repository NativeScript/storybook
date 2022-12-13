import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'storybook', loadChildren: () => import('./plugin-demos/storybook.module').then((m) => m.StorybookModule) },
  { path: 'storybook-device', loadChildren: () => import('./plugin-demos/storybook-device.module').then((m) => m.StorybookDeviceModule) },
  { path: 'storybook-generator', loadChildren: () => import('./plugin-demos/storybook-generator.module').then((m) => m.StorybookGeneratorModule) },
  { path: 'storybook-web', loadChildren: () => import('./plugin-demos/storybook-web.module').then((m) => m.StorybookWebModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
