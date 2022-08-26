export interface InitGeneratorSchema {
  name: string;
  uiFramework: '@storybook/angular' | '@storybook/vue';
  tags?: string;
  directory?: string;
}
