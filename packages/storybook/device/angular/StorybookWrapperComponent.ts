import { AfterViewInit, ElementRef, OnDestroy, Type, ChangeDetectorRef, Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import { ICollection } from './types';
import { STORY_PROPS } from './StorybookProvider';
import { ComponentInputsOutputs, getComponentInputsOutputs } from './utils/NgComponentAnalyzer';

const getNonInputsOutputsProps = (ngComponentInputsOutputs: ComponentInputsOutputs, props: ICollection = {}) => {
  const inputs = ngComponentInputsOutputs.inputs.filter((i) => i.templateName in props).map((i) => i.templateName);
  const outputs = ngComponentInputsOutputs.outputs.filter((o) => o.templateName in props).map((o) => o.templateName);
  return Object.keys(props).filter((k) => ![...inputs, ...outputs].includes(k));
};

/**
 * Wraps the story template into a component
 *
 * @param storyComponent
 * @param initialProps
 */
export const createStorybookWrapperComponent = (selector: string, template: string, storyComponent: Type<unknown> | undefined, styles: string[], initialProps?: ICollection): Type<any> => {
  // In ivy, a '' selector is not allowed, therefore we need to just set it to anything if
  // storyComponent was not provided.
  const viewChildSelector = storyComponent ?? '__storybook-noop';

  //    <ActionBar title="Storybook Preview" flat="true" backgroundColor="#75ACEB" color="#fff"></ActionBar>
  @Component({
    selector,
    template: ` <GridLayout rows="auto, *" columns="*" backgroundColor="#75ACEB" paddingTop="20">
      <StackLayout margin="15" padding="20" borderRadius="15" backgroundColor="#FFF">
        <Label text="Component:" color="#555" fontSize="12"></Label>
        <Label [text]="componentName || '-'" color="#333" fontSize="18" fontWeight="bold"></Label>
      </StackLayout>
      <GridLayout row="1" rows="*" columns="*" backgroundColor="#fff" borderRadius="25 25 0 0"> ${template} </GridLayout>
    </GridLayout>`,
    styles,
  })
  class StorybookWrapperComponent implements AfterViewInit, OnDestroy {
    componentName = 'Hello Testing';
    private storyComponentPropsSubscription: Subscription;

    private storyWrapperPropsSubscription: Subscription;

    @ViewChild(viewChildSelector, { static: true }) storyComponentElementRef: ElementRef;

    @ViewChild(viewChildSelector, { read: ViewContainerRef, static: true })
    storyComponentViewContainerRef: ViewContainerRef;

    // Used in case of a component without selector
    storyComponent = storyComponent ?? '';

    constructor(@Inject(STORY_PROPS) private storyProps$: Subject<ICollection | undefined>, private changeDetectorRef: ChangeDetectorRef) {}

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
        initialOtherProps.forEach((p) => {
          (this.storyComponentElementRef as any)[p] = initialProps[p];
        });
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
              return propsKeyToKeep.reduce((acc, p) => ({ ...acc, [p]: props[p] }), {});
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
