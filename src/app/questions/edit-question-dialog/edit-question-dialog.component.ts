import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { QuestionsService } from '../services/questions.service';
import { OptionsService } from '../../options/services/options.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActQues } from '../../shared/models/actquestion.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { QuestypesService, Type } from '../services/questypes.service';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
export class EditQuestionDialogComponent implements OnInit {

  form: FormGroup;
  question = new ActQues();
  options = new Array();
  selectedType: string;
  loading = false;
  mandQuest = this.data.mandatoryQues;
  avOptions = false;

  listTypes: Type[] = [];
  styles: number[] = [1, 2, 3];

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: QuestionsService, public serviceQt: QuestypesService, public serviceOpt: OptionsService) { }

  ngOnInit() {
    this.initForm();
    this.validateOption();
    this.getOptions();
    this.getQuesTypes();
  }

  initForm() {
    this.form = this.fb.group({
      idQues: [this.data.idQues, Validators.required],
      idSec: [this.data.idSec, Validators.required],
      idOpt: [this.data.idOpt],
      nameQues: [this.data.nameQues, [Validators.required, Validators.maxLength(300)]],
      descQues: [this.data.descQues, Validators.maxLength(500)],
      typeQues: [this.data.typeQues, Validators.required],
      infoQues: [this.data.infoQues],
      mandatoryQues: [this.mandQuest, Validators.required],
      itemValue: [this.data.itemValue],
      orderQues:[this.data.orderQues]
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

  validateOption() {
    if (this.data.idOpt) {
      this.avOptions = true;
      this.form.get('idOpt').setValidators([Validators.required]);
      this.form.get('idOpt').enable();
      this.form.get('idOpt').updateValueAndValidity();
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

  editQuestion(dataOption) {
    if (dataOption) {
      this.form.get('idOpt').setValue(dataOption.idOption);
    }

    this.question = new ActQues(this.form.value);
    this.loading = true;
    (this.service.edit(this.question)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), (err) => snackError(this.snackbar, err));
  }

  editOk() {
    snackOk(this.snackbar, 'Pregunta actualizada');
    this.dialogRef.close();
  }

}
