import { Component } from '@angular/core';

@Component({
  selector: 'demo-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  demos = [
    {
      name: 'storybook',
    },
    {
      name: 'storybook-device',
    },
    {
      name: 'storybook-generator',
    },
    {
      name: 'storybook-web',
    },
  ];
}
