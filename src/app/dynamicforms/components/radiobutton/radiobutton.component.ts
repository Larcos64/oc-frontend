import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent implements OnInit {

  @Output() exampleOutputQuestion = new EventEmitter<any>()
  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  observation = '';
  constructor() { }

  ngOnInit() {
  }

  radioChange() {
    let response = this.form.value[this.field.name];
    const res = this.field.itemValue ? { id: response, observacion: this.observation } : response;
      this.emitResponse(res);
  }

  emitResponse(response){
    // this.form.controls[this.field.name].setValue(response);
    this.field.value = response;
    this.exampleOutputQuestion.emit({ res: response, field: this.field });
  }

}
