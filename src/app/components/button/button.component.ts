import { Component, Input } from '@angular/core'

@Component({
  selector: 'ns-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
    // @Input() text: string | undefined = 'BUTTON';
    // @Input() color: string | undefined  = '#FFF';
    // @Input() backgroundColor: string | undefined  = '#75ACEB';
    // @Input() borderColor: string | undefined = '#75ACEB';
    // @Input() borderRadius = 15;
    // @Input() fontSize = 12;
    // @Input() fontWeight = 400;
    @Input() props: any;

    ngOnChanges(): void {}
}
