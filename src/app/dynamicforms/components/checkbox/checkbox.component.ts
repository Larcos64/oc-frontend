import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Output() exampleOutputQuestion = new EventEmitter<any>()
  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  values = new Array();

  constructor() { }

  ngOnInit() {
  }

  onChange(item: string, isChecked: boolean) {
    if (isChecked['checked']) {
      this.values.push(item);
    } else {
      let index = this.values.findIndex(x => x == item);
      this.values.splice(index, 1);
    }
    this.form.controls[this.field.name].setValue(this.values);
    this.field.value = this.values
    this.exampleOutputQuestion.emit({ res: this.values, field: this.field })
  }

}
