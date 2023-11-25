import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Output() exampleOutputQuestion = new EventEmitter<any>()
  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  constructor() { }
  ngOnInit() {
  }

  verifyVal() {
    if (this.field.type == 'money') {
      var value = this.form.get(this.field.name).value;

      this.field.value = value;
      this.exampleOutputQuestion.emit({ res: value, field: this.field }); // For dependency

      let indAlert = this.field.validations.findIndex(alert => alert.name === 'warning');

      if (indAlert >= 0) {


        switch (this.field.validations[indAlert].operator) {
          case '<':
            if (value < this.field.validations[indAlert]['value']) {
              var r = confirm(this.field.validations[indAlert].message);
              if (r == true) {
                this.form.controls[this.field.name].setValue(value);
              } else {
                this.form.controls[this.field.name].setValue('');
              }
            }
          break;
          case '>':
            if (value > this.field.validations[indAlert]['value']) {
              var r = confirm(this.field.validations[indAlert].message);
              if (r == true) {
                this.form.controls[this.field.name].setValue(value);
              } else {
                this.form.controls[this.field.name].setValue('');
              }
            }
          break;
        }
      }
    }
  }



}
