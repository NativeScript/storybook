import { Component, Input } from '@angular/core';

@Component({
  selector: 'ns-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() title: string;
  @Input() titleColor: string;
  @Input() content: string;
  @Input() contentColor: string;
  @Input() borderRadius: string;
  @Input() imageBorderRadius: string;
  @Input() boxShadow: string;
  @Input() imageSrc: string;

  ngOnChanges(): void {}
}
