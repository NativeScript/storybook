import { StoryFnAngularReturnType } from './types';
import { createStorybookWrapperComponent } from './StorybookWrapperComponent';
import { computesTemplateFromComponent } from './ComputesTemplateFromComponent';

export const getApplication = ({ storyFnAngular, component, targetSelector }: { storyFnAngular: StoryFnAngularReturnType; component?: any; targetSelector: string }) => {
  const { props, styles, moduleMetadata = {} } = storyFnAngular;
  let { template } = storyFnAngular;

  const hasTemplate = !hasNoTemplate(template);
  if (!hasTemplate && component) {
    template = computesTemplateFromComponent(component, props, '');
  }

  /**
   * Create a component that wraps generated template and gives it props
   */
  return createStorybookWrapperComponent(targetSelector, template, component, styles, moduleMetadata, props);
};

function hasNoTemplate(template: string | null | undefined): template is undefined {
  return template === null || template === undefined;
}
