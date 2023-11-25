import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../../question-base';
import { FieldConfig } from '../../field.interface';
import { MatSelectChange } from '@angular/material';


@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html'
})
export class QuestionsFormComponent {

  @Input() field: FieldConfig;
  @Input() form: FormGroup;
  @Output() exampleOutputToSection = new EventEmitter<any>();

  constructor() {
    //console.log(this.field);
  }

  get isValid() {
    return this.form.controls[this.field.name].valid;
  }

  exampleMethodParentSelect($event) {
    this.exampleOutputToSection.emit($event)
  }

}