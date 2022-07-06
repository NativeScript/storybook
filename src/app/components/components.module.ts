import { ComponentFactoryResolver, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BaseModule } from "../core/base.module";
import { ButtonComponent } from "./button/button.component";
import { LabelComponent } from "./label/label.component";
import { CardComponent } from "./card/card.component";
import { ImageCacheItModule } from "@triniwiz/nativescript-image-cache-it/angular";

@NgModule({
  imports: [CommonModule, ImageCacheItModule],
  declarations: [ButtonComponent, LabelComponent, CardComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule extends BaseModule {
  dynamicComponents = [ButtonComponent, LabelComponent, CardComponent];

  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    super(componentFactoryResolver);
  }
}