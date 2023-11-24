import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ActCondition } from '../../shared/models/actcondition.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ConditionsService } from '../services/conditions.service';
import { CondtypesService, Condition } from '../services/condtypes.service';
import { OperatorsService, Operator } from '../services/operators.service';

@Component({
  selector: 'app-edit-condition-dialog',
  templateUrl: './edit-condition-dialog.component.html',
  styleUrls: ['./edit-condition-dialog.component.scss']
})
export class EditConditionDialogComponent implements OnInit {

  form: FormGroup;
  condition = new ActCondition();
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

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditConditionDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ConditionsService, public serviceCt: CondtypesService, public serviceOt: OperatorsService) { }

  ngOnInit() {
    this.initForm();
    this.getCondTypes();
    this.onTypeChange(this.data.typeCond, false);
    this.onOperChange(this.data.operatorCond, false);
  }

  initForm() {
    this.form = this.fb.group({
      idCond: [this.data.idCond, Validators.required],
      idQues: [this.data.idQues, Validators.required],
      typeCond: [this.data.typeCond, Validators.required],
      operatorCond: [this.data.operatorCond],
      valueCond: [],
      otherValueCond: [],
      valueOptions: [this.data.valueCond],
      valueDates: [this.data.valueCond],
      messageCond: [this.data.messageCond, Validators.required]
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
      // console.log("D: ", field);
      this.form.get(field).clearValidators();
      this.form.get(field).disable();
      this.form.get(field).updateValueAndValidity();
    }
  }

  enableFields(enaFields) {
    for (const field of enaFields) {
      // console.log("E: ", field);
      this.form.get(field).setValidators([Validators.required]);
      this.form.get(field).enable();
      this.form.get(field).updateValueAndValidity();
    }
  }

  onOperChange(tp, fromForm) {
    if (fromForm) {
      this.selectedOper = tp.value;
    } else {
      this.selectedOper = tp;
    }

    if (this.selectedOper === '[]') {
      this.avOtherValue = true;

      let splitValue = this.data.valueCond.split('-');
      this.form.controls.valueCond.setValue(splitValue[0]);
      this.form.controls.otherValueCond.setValue(splitValue[1]);

      // Enable and required fields
      this.enaFields = ['otherValueCond'];
      this.enableFields(this.enaFields);
    } else {
      this.avOtherValue = false;

      this.form.controls.valueCond.setValue(this.data.valueCond);

      // Disabled and not required fields
      this.disFields = ['otherValueCond'];
      this.disableFields(this.disFields);
    }
  }

  onTypeChange(tp, fromForm) {

    if (fromForm) {
      this.selectedType = tp.value;
    } else {
      this.selectedType = tp;
    }

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

  editCondition() {
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

    // console.log("F: ", this.form.value);

    this.condition = new ActCondition(this.form.value);
    this.loading = true;
    (this.service.edit(this.condition)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), (err) => snackError(this.snackbar, err));
  }

  editOk() {
    snackOk(this.snackbar, 'Condición actualizada');
    this.dialogRef.close();
  }

}
