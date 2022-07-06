import { Component, Input } from '@angular/core'

@Component({
  selector: 'ns-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
    // @Input() title: string | undefined = 'NativeScript x Storybook';
    // @Input() titleColor: string | undefined = '#555';
    // @Input() content: string | undefined = 'Is this cool or what?';
    // @Input() contentColor: string | undefined = '#777';
    // @Input() imageSrc: string | undefined = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80';
    // @Input() boxShadow: string | undefined = '1 1 5 5 rgba(0,0,0,0.5)'
    // @Input() borderRadius: number | undefined = 30;
    // @Input() imageBorderRadius: number | undefined = 30;
    // @Input() props: any = {
    //   imageSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80'
    // }
    @Input() props: any;

    ngOnChanges(): void {}
}
