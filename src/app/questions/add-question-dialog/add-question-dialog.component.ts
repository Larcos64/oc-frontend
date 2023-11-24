import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { ActQues } from '../../shared/models/actquestion.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { QuestionsService } from '../services/questions.service';
import { OptionsService } from '../../options/services/options.service';
import { QuestypesService, Type } from '../services/questypes.service';

@Component({
  selector: 'app-add-question-dialog',
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.scss']
})
export class AddQuestionDialogComponent implements OnInit {

  form: FormGroup;
  question = new ActQues();
  options = new Array();
  selectedType: string;
  loading = false;
  mandQuest = false;
  avOptions = false;

  listTypes: Type[] = [];
  styles: number[] = [1, 2, 3];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, public service: QuestionsService,
    public serviceOpt: OptionsService, public serviceQt: QuestypesService, private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<AddQuestionDialogComponent>) { }

  ngOnInit() {
    this.initForm();
    this.getQuesTypes();
    this.getOptions();
  }

  initForm() {
    this.form = this.fb.group({
      idSec: [parseInt(this.data.idSec), Validators.required],
      idOpt: [''],
      nameQues: ['', [Validators.required, Validators.maxLength(300)]],
      descQues: ['', Validators.maxLength(500)],
      typeQues: ['', Validators.required],
      infoQues: [''],
      mandatoryQues: [this.mandQuest, Validators.required],
      itemValue: [''],
      orderQues: [this.data.orderQues, Validators.required]

    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getQuesTypes() {
    this.listTypes = this.serviceQt.getTypes();
  }

  getOptions() {
    this.serviceOpt.list().subscribe(options => {
      this.options = options;
    });
  }

  changeMandatory(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.mandQuest = true;
      this.form.get('mandatoryQues').setValue(this.mandQuest);
    } else {
      this.mandQuest = false;
      this.form.get('mandatoryQues').setValue(this.mandQuest);
    }
  }

  onTypeChange(tp) {
    this.selectedType = tp.value;
    if (this.selectedType === "radio_button_checked" || this.selectedType === "check_box" || this.selectedType === "arrow_drop_down_circle") {
      this.avOptions = true;
      this.form.get('idOpt').setValidators([Validators.required]);
      this.form.get('idOpt').enable();
      this.form.get('idOpt').updateValueAndValidity();
    } else {
      this.avOptions = false;
      this.form.get('idOpt').clearValidators();
      this.form.get('idOpt').disable();
      this.form.get('idOpt').updateValueAndValidity();
    }
  }

  saveQuestion(dataOption) {
    if (dataOption) {
      this.form.get('idOpt').setValue(dataOption.idOption);
    }

    this.question = new ActQues(this.form.value);
    this.loading = true;
    (this.service.add(this.question)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Pregunta registrada');
    this.dialogRef.close();
  }

}
