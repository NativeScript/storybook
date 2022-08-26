export interface InitGeneratorSchema {
  name: string;
  uiFramework: '@storybook/angular' | '@storybook/vue';
  includeExample: boolean;
  directory?: string;
}
