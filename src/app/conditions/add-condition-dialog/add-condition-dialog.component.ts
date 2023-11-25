import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { ActCondition } from '../../shared/models/actcondition.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ConditionsService } from '../services/conditions.service';
import { CondtypesService, Condition } from '../services/condtypes.service';
import { OperatorsService, Operator } from '../services/operators.service';

@Component({
  selector: 'app-add-condition-dialog',
  templateUrl: './add-condition-dialog.component.html',
  styleUrls: ['./add-condition-dialog.component.scss']
})
export class AddConditionDialogComponent implements OnInit {

  form: FormGroup;
  condition = new ActCondition();
  options = new Array();
  selectedType: string;
  selectedOper: string;
  loading = false;
  avOperators = false;
  avOptions = false;
  avDates = false;
  avValue = false;
  avOtherValue = false;
  indqt: number;
  indct: number;
  indop: number;
  chosenType: string;
  chosenOper: string;

  allTypes: Condition[] = [];
  allOperators: Operator[] = [];
  allOptions: Operator[] = [];

  listTypes = [];
  listOperators = [];
  listOptions = [];

  enaFields = new Array<string>();
  disFields = new Array<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public service: ConditionsService,
    public serviceCt: CondtypesService, public serviceOt: OperatorsService, private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<AddConditionDialogComponent>) { }

  ngOnInit() {
    this.initForm();
    this.getCondTypes();
  }

  initForm() {
    this.form = this.fb.group({
      idQues: [parseInt(this.data.idQues), Validators.required],
      typeCond: ['', Validators.required],
      operatorCond: [''],
      valueCond: [''],
      otherValueCond: [''],
      valueOptions: [''],
      valueDates: [''],
      messageCond: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getCondTypes() {
    this.allTypes = this.serviceCt.getConditions();
    this.indqt = this.allTypes.findIndex(qtype => qtype.ques_type === this.data.typeQues);
    this.listTypes = this.serviceCt.getCondTypes(this.indqt);
  }

  getOpTypes(selectedType) {
    this.allOperators = this.serviceOt.getOperators();
    this.indct = this.allOperators.findIndex(ctype => ctype.cond_type === selectedType);
    this.listOperators = this.serviceOt.getOpTypes(this.indct);
  }

  getOptTypes(selectedType) {
    this.allOptions = this.serviceOt.getOperators();
    this.indop = this.allOptions.findIndex(opt => opt.cond_type === selectedType);
    this.listOptions = this.serviceOt.getOpTypes(this.indop);
  }

  disableFields(disFields) {
    for (const field of disFields) {
      this.form.get(field).clearValidators();
      this.form.get(field).disable();
      this.form.get(field).updateValueAndValidity();
    }
  }

  enableFields(enaFields) {
    for (const field of enaFields) {
      this.form.get(field).setValidators([Validators.required]);
      this.form.get(field).enable();
      this.form.get(field).updateValueAndValidity();
    }
  }

  onOperChange(tp) {
    this.selectedOper = tp.value;
    if (this.selectedOper === '[]') {
      this.avOtherValue = true;
      // Enable and required fields
      this.enaFields = ['otherValueCond'];
      this.enableFields(this.enaFields);
    } else {
      this.avOtherValue = false;
      // Disabled and not required fields
      this.disFields = ['otherValueCond'];
      this.disableFields(this.disFields);
    }
  }

  onTypeChange(tp) {
    this.selectedType = tp.value;
    if (this.selectedType === 'lenght' || this.selectedType === 'warning') {
      this.avOperators = true;
      this.avValue = true;
      this.avOptions = false;
      this.avDates = false;
      this.getOpTypes(this.selectedType);

      // Enable and required fields
      this.enaFields = ['operatorCond'];
      this.enableFields(this.enaFields);

      this.form.get('valueCond').setValidators([Validators.required]);
      this.form.get('valueCond').updateValueAndValidity();

      // Disabled and not required fields
      this.disFields = ['valueOptions', 'valueDates'];
      this.disableFields(this.disFields);
    } else if (this.selectedType === 'min' || this.selectedType === 'max') {
      this.avValue = true;
      this.avOperators = false;
      this.avOptions = false;
      this.avDates = false;

      // Enable and required fields
      this.form.get('valueCond').setValidators([Validators.required]);
      this.form.get('valueCond').updateValueAndValidity();

      // Disabled and not required fields
      this.disFields = ['operatorCond', 'valueOptions', 'valueDates'];
      this.disableFields(this.disFields);
    } else if (this.selectedType === 'type') {
      this.avOptions = true;
      this.avOperators = false;
      this.avValue = false;
      this.avDates = false;
      this.getOptTypes(this.selectedType);

      // Enable and required fields
      this.enaFields = ['valueOptions'];
      this.enableFields(this.enaFields);

      this.form.get('valueCond').clearValidators();
      this.form.get('valueCond').updateValueAndValidity();

      // Disabled and not required fields
      this.disFields = ['operatorCond', 'valueDates'];
      this.disableFields(this.disFields);
    } else if (this.selectedType === 'file_type' || this.selectedType === 'file_format' || this.selectedType === 'file_limit') {
      this.avOptions = true;
      this.avOperators = false;
      this.avValue = false;
      this.avDates = false;
      this.getOptTypes(this.selectedType);

      // Enable and required fields
      this.enaFields = ['valueOptions'];
      this.enableFields(this.enaFields);

      this.form.get('valueCond').clearValidators();
      this.form.get('valueCond').updateValueAndValidity();

      // Disabled and not required fields
      this.disFields = ['operatorCond', 'valueDates'];
      this.disableFields(this.disFields);
    } else if (this.selectedType === 'mindate' || this.selectedType === 'maxdate' || this.selectedType === 'filter') {
      this.avDates = true;
      this.avOperators = false;
      this.avValue = false;
      this.avOptions = false;

      // Enable and required fields
      this.enaFields = ['valueDates'];
      this.enableFields(this.enaFields);

      this.form.get('valueCond').clearValidators();
      this.form.get('valueCond').updateValueAndValidity();

      // Disabled and not required fields
      this.disFields = ['valueOptions', 'operatorCond'];
      this.disableFields(this.disFields);
    }
  }

  saveCondition() {
    this.chosenType = this.form.get('typeCond').value;
    switch (this.chosenType) {
      case 'type':
      case 'file_type':
      case 'file_format':
      case 'file_limit':
        this.form.controls.valueCond.setValue(this.form.get('valueOptions').value);
        break;
      case 'mindate':
      case 'maxdate':
      case 'filter':
        this.form.controls.valueCond.setValue(this.form.get('valueDates').value);
        break;
    }

    this.chosenOper = this.form.get('operatorCond').value;
    switch (this.chosenOper) {
      case '[]':
        this.form.controls.valueCond.setValue(this.form.get('valueCond').value + '-' + this.form.get('otherValueCond').value);
        break;
    }

    this.condition = new ActCondition(this.form.value);
    this.loading = true;
    (this.service.add(this.condition)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Condición registrada');
    this.dialogRef.close();
  }

}
