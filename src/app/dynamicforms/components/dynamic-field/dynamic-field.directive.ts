import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { InputComponent } from '../input/input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { SelectComponent } from "../select/select.component";
import { FileinputComponent } from "../fileinput/fileinput.component";
import { DateComponent } from "../date/date.component";
import { ButtonComponent } from "../button/button.component";

const componentMapper = {
  short_text: InputComponent,
  money: InputComponent,
  notes: TextareaComponent,
  radio_button_checked: RadiobuttonComponent,
  check_box: CheckboxComponent,
  arrow_drop_down_circle: SelectComponent,
  cloud_upload: FileinputComponent,
  event: DateComponent,
  button: ButtonComponent
};

@Directive({
  // selector: '[appDynamicField]'
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {

  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  componentRef: any;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }

}
