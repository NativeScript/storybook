import { Meta, StoryFn } from '@storybook/angular';

import { CardComponent } from './card.component';
import { Application } from '@nativescript/core';

console.log('Application', Application);

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  id: 'example-card',
  title: 'Example/card',
  component: CardComponent,
  argTypes: {
    title: { control: 'text' },
    titleColor: { control: 'color' },
    content: { control: 'text' },
    contentColor: { control: 'color' },
    borderRadius: { control: { type: 'range', min: 0, max: 30, step: 1 } },
    imageBorderRadius: { control: { type: 'range', min: 0, max: 30, step: 1 } },
    boxShadow: { control: 'text' },
    imageSrc: { control: 'text' },
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: StoryFn<CardComponent> = (args: CardComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  title: 'NativeScript x Storybook',
  titleColor: '#555',
  content: 'Well this is helpful',
  contentColor: '#777',
  borderRadius: 10,
  imageBorderRadius: 10,
  boxShadow: '2 2 5 5 rgba(0,0,0,0.5)',
  imageSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
};

export const Secondary = Template.bind({});
Secondary.args = {
  title: 'Storybook on Simulators',
  titleColor: '#75ACEB',
  content: 'This is pretty cool right?',
  contentColor: '#777',
  borderRadius: 0,
  imageBorderRadius: 0,
  boxShadow: '0 0 5 0 #75ACEB',
  imageSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
};
