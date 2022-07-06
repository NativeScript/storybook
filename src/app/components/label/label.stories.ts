// Button.stories.ts

import { Meta, Story } from '@storybook/angular';

import { LabelComponent } from './label.component';
import { listenToStoryChange } from '../../core/deep-link-generator';


// TODO: move this to somewhere that makes sense
// it has to be called once to generate deeplinks
listenToStoryChange(process.env.STORYBOOK_TARGET_PLATFORM as any);

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  id: 'ns-label', // has to match your component's selector
  title: 'Example/Label',
  component: LabelComponent,
  // More on argTypes: https://storybook.js.org/docs/angular/api/argtypes
  argTypes: {
    text: { control: 'text' },
    color: { control: 'color' },
  },
} as Meta;


// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<LabelComponent> = (args: LabelComponent) => ({
  props: { props: args },
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Primary.args = {
  text: 'Primary',
  color: '#75ACEB'
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Secondary',
  color: '#55B585'
};
