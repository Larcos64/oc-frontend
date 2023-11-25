import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  errMinDate: string;
  errMaxDate: string;

  @Output() exampleOutputQuestion = new EventEmitter<any>()
  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.buildValidators();
  }

  buildValidators() {
    let indMinVal = this.field.validations.findIndex(min => min.name === 'min');
    if (indMinVal >= 0) {
      // const currentYear = new Date().getFullYear();
      this.minDate = new Date(this.field.validations[indMinVal]['value']);
      this.errMinDate = this.field.validations[indMinVal]['message'];
      // this .minDate = new  Date (currentYear - 20 , 0 , 1 );
    }

    let indMaxVal = this.field.validations.findIndex(max => max.name === 'max');
    if (indMaxVal >= 0) {
      this.maxDate = new Date(this.field.validations[indMaxVal]['value']);
      this.errMaxDate = this.field.validations[indMaxVal]['message'];
      // this.maxDate = new Date(currentYear + 1, 11, 31);
    }
  }


}
