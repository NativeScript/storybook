import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core'
import { UrlHandlerService } from '../services/url-handler.service';
import { DynamicComponentService } from '../services/dynamic-component.service';

@Component({
  selector: 'ns-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {
  @ViewChild('target', { read: ViewContainerRef, static: true })
  target: ViewContainerRef;
  componentName: string = '';

  constructor(
    private cfr: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    private dynamicComponentService: DynamicComponentService,
  ) { }

  ngOnInit(): void {
    this.listenToUrlChange();
  }

  listenToUrlChange(): void {
    let storybookUrl;
    UrlHandlerService.getInstance().handleOpenURL((storybook) => {
      if (storybook?.url === storybookUrl) {
        return;
      }
      storybookUrl = storybook.url;

      console.log('======================================');
      console.log('url changed', storybook);

      this.target.clear();
      if (!!storybook.params?.component) {
        this.componentName = storybook.params.component;
        const argsString = decodeURIComponent(storybook.params.args)
        // console.log('argsString:', argsString)
        let args = {}
        if (argsString) {
          args = argsString.split(';').reduce((args, arg) => {
            const isHttpValue = arg.indexOf(':https://') > -1;
            const [key, val] = isHttpValue ? arg.split(':https://') : arg.split(':');
            if (val?.includes('!hex')) {
              args[key] = `#${val.match(/\(([^)]+)\)/)[1]}`;
            } else if (isHttpValue) {
              args[key] = `https://${val}`;
            } else {
              args[key] = val;
            }
            return args;
          }, {})
          console.log('args', args);
        }
        this.dynamicComponentService.getComponentBySelector(storybook.params.component, () => import("../components/components.module").then(m => m.ComponentsModule)).then(componentRef => {
          this.addComponentInputs(componentRef, { props: args });
          this.target.insert(componentRef.hostView);
          this.changeDetectorRef.detectChanges();
        }).catch(error => {
          console.log('error', error);
        });
      } else {
        this.componentName = '';
      }
      console.log('--------------------------------------');
    })
  }

  addComponentInputs(componentRef: ComponentRef<unknown>, inputs: any) {
    if (componentRef && componentRef.instance && inputs) {
      Object.keys(inputs).forEach(p => {
        return (componentRef.instance[p] = inputs[p])
      });
      (<any>componentRef.instance).ngOnChanges();
      componentRef.changeDetectorRef.detectChanges();
    }
  }
}
