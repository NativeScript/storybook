import { AfterViewInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, NgModule, NO_ERRORS_SCHEMA, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { ICollection, NgModuleMetadata } from './types';
import { STORY_PROPS } from './StorybookProvider';
import { ComponentInputsOutputs, getComponentInputsOutputs } from './utils/NgComponentAnalyzer';
import { PropertyExtractor } from './utils/PropertyExtractor';

const getNonInputsOutputsProps = (ngComponentInputsOutputs: ComponentInputsOutputs, props: ICollection = {}) => {
  const inputs = ngComponentInputsOutputs.inputs.filter((i) => i.templateName in props).map((i) => i.templateName);
  const outputs = ngComponentInputsOutputs.outputs.filter((o) => o.templateName in props).map((o) => o.templateName);
  return Object.keys(props).filter((k) => ![...inputs, ...outputs].includes(k));
};

// component modules cache
export const componentNgModules = new Map<any, Type<any>>();

/**
 * Wraps the story template into a component
 *
 * @param storyComponent
 * @param initialProps
 */
export const createStorybookWrapperComponent = (selector: string, template: string | undefined, storyComponent: Type<unknown> | undefined, styles: string[] | undefined, moduleMetadata: NgModuleMetadata, initialProps?: ICollection): Type<any> => {
  // In ivy, a '' selector is not allowed, therefore we need to just set it to anything if
  // storyComponent was not provided.
  const viewChildSelector = storyComponent ?? '__storybook-noop';

  const analyzedMetadata = new PropertyExtractor(moduleMetadata, storyComponent);
  const { imports, declarations, providers } = analyzedMetadata;

  // Only create a new module if it doesn't already exist
  // This is to prevent the module from being recreated on every story change
  // Declarations & Imports are only added once
  // Providers are added on every story change to allow for story-specific providers
  let ngModule = <any>componentNgModules.get(storyComponent);
  if (!ngModule) {
    @NgModule({
      declarations,
      imports,
      exports: [...(<any>declarations), ...(<any>imports)],
    })
    class StorybookComponentModule {}

    componentNgModules.set(storyComponent, StorybookComponentModule);
    ngModule = componentNgModules.get(storyComponent);
  }

  @Component({
    selector,
    template: `<GridLayout backgroundColor="red">${template}</GridLayout>`,
    standalone: true,
    imports: [ngModule],
    providers,
    styles,
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ...(moduleMetadata.schemas || [])],
  })
  class StorybookWrapperComponent implements AfterViewInit, OnDestroy {
    private storyComponentPropsSubscription: Subscription;

    private storyWrapperPropsSubscription: Subscription;

    @ViewChild(viewChildSelector, { static: true }) storyComponentElementRef: ElementRef;

    @ViewChild(viewChildSelector, { read: ViewContainerRef, static: true })
    storyComponentViewContainerRef: ViewContainerRef;

    // Used in case of a component without selector
    storyComponent = storyComponent ?? '';

    constructor(@Inject(STORY_PROPS) private storyProps$: Subject<ICollection | undefined>, @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
      // Subscribes to the observable storyProps$ to keep these properties up to date
      this.storyWrapperPropsSubscription = this.storyProps$.subscribe((storyProps = {}) => {
        // All props are added as component properties
        Object.assign(this, storyProps);

        this.changeDetectorRef.detectChanges();
        this.changeDetectorRef.markForCheck();
      });
    }

    ngAfterViewInit(): void {
      // Bind properties to component, if the story have component
      if (this.storyComponentElementRef) {
        const ngComponentInputsOutputs = getComponentInputsOutputs(storyComponent);

        const initialOtherProps = getNonInputsOutputsProps(ngComponentInputsOutputs, initialProps);

        // Initializes properties that are not Inputs | Outputs
        // Allows story props to override local component properties
        if (initialProps) {
          initialOtherProps.forEach((p) => {
            (this.storyComponentElementRef as any)[p] = initialProps[p];
          });
        }
        // `markForCheck` the component in case this uses changeDetection: OnPush
        // And then forces the `detectChanges`
        this.storyComponentViewContainerRef.injector.get(ChangeDetectorRef).markForCheck();
        this.changeDetectorRef.detectChanges();

        // Once target component has been initialized, the storyProps$ observable keeps target component properties than are not Input|Output up to date
        this.storyComponentPropsSubscription = this.storyProps$
          .pipe(
            skip(1),
            map((props) => {
              const propsKeyToKeep = getNonInputsOutputsProps(ngComponentInputsOutputs, props);
              return propsKeyToKeep.reduce((acc, p) => ({ ...acc, [p]: props ? props[p] : null }), {});
            })
          )
          .subscribe((props) => {
            // Replace inputs with new ones from props
            Object.assign(this.storyComponentElementRef, props);

            // `markForCheck` the component in case this uses changeDetection: OnPush
            // And then forces the `detectChanges`
            this.storyComponentViewContainerRef.injector.get(ChangeDetectorRef).markForCheck();
            this.changeDetectorRef.detectChanges();
          });
      }
    }

    ngOnDestroy(): void {
      if (this.storyComponentPropsSubscription != null) {
        this.storyComponentPropsSubscription.unsubscribe();
      }
      if (this.storyWrapperPropsSubscription != null) {
        this.storyWrapperPropsSubscription.unsubscribe();
      }
    }
  }
  return StorybookWrapperComponent;
};
