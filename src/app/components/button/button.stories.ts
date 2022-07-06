// Button.stories.ts

import { Meta, Story } from '@storybook/angular';

import { ButtonComponent } from './button.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  id: 'ns-button',
  title: 'Example/Button',
  component: ButtonComponent,
  argTypes: {
    text: { control: 'text' },
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
    borderRadius: { control: { type: 'range', min: 0, max: 25, step: 1 } },
    fontSize: { control: { type: 'range', min: 7, max: 40, step: 1 } },
    fontWeight: { control: { type: 'range', min: 300, max: 800, step: 100 } },
    boxShadow: { control: 'text' },
  },
} as Meta;


// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: { props: args },
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/angular/writing-stories/args
Primary.args = {
  text: 'Primary',
  color: '#FFF',
  backgroundColor: '#75ACEB',
  borderColor: 'transparent',
  borderRadius: 15,
  boxShadow: '2 2 5 5 rgba(0,0,0,0.5)',
  fontSize: 12,
  fontWeight: 400
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Secondary',
  color: '#75ACEB',
  backgroundColor: '#FFF',
  borderColor: '#75ACEB',
  borderRadius: 15,
  boxShadow: '2 2 5 5 rgba(164,164,164,0.5)',
  fontSize: 12,
  fontWeight: 400
};
