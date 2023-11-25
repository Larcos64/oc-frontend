import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { ActDependency } from '../../shared/models/actdependency.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { DependenciesService } from '../services/dependencies.service';
import { SectionsService } from '../../sections/services/sections.service';
import { QuestionsService } from '../../questions/services/questions.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';
import { OperatorsService, Operator } from '../services/operators.service';

@Component({
  selector: 'app-add-dependency-dialog',
  templateUrl: './add-dependency-dialog.component.html',
  styleUrls: ['./add-dependency-dialog.component.scss']
})
export class AddDependencyDialogComponent implements OnInit {

  form: FormGroup;
  dependency = new ActDependency();
  selectedSec: number;
  selectedQues: number;
  indot: number;
  idOpt: number;
  typeQues: string;
  avOperators = false;
  avOptValues = false;
  avValue = false;
  loading = false;
  orDep = false;
  avQues = false;

  sections = new Array();
  questions = new Array();
  parentquestion = new Array();
  optvalues = new Array();
  enaFields = new Array<string>();
  disFields = new Array<string>();

  allOperators: Operator[] = [];

  listOperators = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public service: DependenciesService,
    public serviceSec: SectionsService, public serviceQues: QuestionsService, public serviceOt: OperatorsService,
    public serviceOptVal: OptvaluesService, private snackbar: MatSnackBar, public dialogRef: MatDialogRef<AddDependencyDialogComponent>) { }

  ngOnInit() {
    this.initForm();
    this.getSections();
  }

  initForm() {
    this.form = this.fb.group({
      secQues: [''],
      idQues: ['', Validators.required],
      idSec: [],
      idQues2: [],
      operatorDep: [''],
      optValues: [''],
      valueDep: [''],
      orDep: [this.orDep]
    });

    if (this.data.idQues) {
      this.form.controls.idQues2.setValue(parseInt(this.data.idQues));
      this.disFields = ['idSec'];
      this.disableFields(this.disFields);
    } else if (this.data.idSec) {
      this.form.controls.idSec.setValue(parseInt(this.data.idSec));
      this.disFields = ['idQues2'];
      this.disableFields(this.disFields);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getSections() {
    this.serviceSec.list().subscribe(sections => {
      this.sections = sections;
    });
  }

  getQuestions(idSec) {
    // this.serviceQues.listByIdSec(idSec).subscribe(questions => {
    this.serviceQues.listByIdSecNotIn(idSec).subscribe(questions => {
      this.questions = questions;
    });
  }

  getParentQuestion(idQues) {
    this.serviceQues.quesById(idQues).subscribe(question => {
      this.parentquestion = question[0];
      this.idOpt = this.parentquestion['id_opt'];
      this.typeQues = this.parentquestion['type_ques'];
      this.buildFields(this.idOpt, this.typeQues);
    });
  }

  getOpTypes(typeQues) {
    this.allOperators = this.serviceOt.getOperators();
    this.indot = this.allOperators.findIndex(ctype => ctype.ques_type === typeQues);
    this.listOperators = this.serviceOt.getOpTypes(this.indot);
  }

  getOptValues(idOpt) {
    this.serviceOptVal.listByIdOpt(idOpt).subscribe(options => {
      this.optvalues = options;
    });
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

  buildFields(idOpt, typeQues) {
    if (typeQues === 'money') {
      this.avOperators = true;
      this.avValue = true;
      this.avOptValues = false;
      this.getOpTypes(typeQues);

      // Enable and required fields
      this.enaFields = ['operatorDep', 'valueDep'];
      this.enableFields(this.enaFields);

      // Disabled and not required fields
      this.disFields = ['optValues'];
      this.disableFields(this.disFields);
    } else if (typeQues === 'radio_button_checked' || typeQues === 'check_box' || typeQues === 'arrow_drop_down_circle') {
      this.avOptValues = true;
      this.avValue = false;
      this.avOperators = false;
      this.getOptValues(idOpt);

      // Enable and required fields
      this.enaFields = ['optValues'];
      this.enableFields(this.enaFields);

      this.form.get('operatorDep').clearValidators();
      this.form.get('operatorDep').updateValueAndValidity();

      this.form.get('valueDep').clearValidators();
      this.form.get('valueDep').updateValueAndValidity();
    }
  }

  onSecChange(sec) {
    this.selectedSec = sec.value;
    if (this.selectedSec) {
      this.avQues = true;
      this.getQuestions(this.selectedSec);
    }
  }

  onQuesChange(ques) {
    this.selectedQues = ques.value;
    if (this.selectedQues) {
      this.getParentQuestion(this.selectedQues);
    }
  }

  changeDependency(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.orDep = true;
      this.form.get('orDep').setValue(this.orDep);
    } else {
      this.orDep = false;
      this.form.get('orDep').setValue(this.orDep);
    }
  }

  saveDependency() {
    switch (this.typeQues) {
      case 'radio_button_checked':
      case 'check_box':
      case 'arrow_drop_down_circle':
        this.form.controls.operatorDep.setValue('==');
        this.form.controls.valueDep.setValue(this.form.get('optValues').value);
        break;
    }

    this.dependency = new ActDependency(this.form.value);
    this.loading = true;
    (this.service.add(this.dependency)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Dependencia registrada');
    this.dialogRef.close();
  }

}
