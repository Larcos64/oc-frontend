import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Output() exampleOutputQuestion = new EventEmitter<any>()
  @Input() field: FieldConfig;
  @Input() form: FormGroup;


  constructor() { }

  ngOnInit() {
  }

  selectChange($event: MatSelectChange) {
    var response = this.form.value[this.field.name]
    this.field.value = response
    this.exampleOutputQuestion.emit({ res: response, field: this.field })
  }
}
