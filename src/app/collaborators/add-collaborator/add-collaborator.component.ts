import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActFormat } from '../../shared/models/actformat.model';
import { SessionService } from 'src/app/core/services/session.service';
import { MatSnackBar, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AcsCollaborator } from 'src/app/shared/models/acscollaborator.model';
import { finalize } from 'rxjs/operators';
import { CollaboratorserviceService } from '../services/collaboratorservice.service';
import { snackError, snackOk } from '../../util/snackbar-util';
import { Router, ActivatedRoute } from '@angular/router';
import { listEps } from '../../data-list/eps';
import { listAfp } from '../../data-list/afp';
import { listSeverance } from '../../data-list/severance_pay';
import { listCompensation } from '../../data-list/compensation_box';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.scss']
})
export class AddCollaboratorComponent implements OnInit {

  form: FormGroup;
  format = new ActFormat();
  loading = false;
  idComp: number;
  errorOtherSpecial = false;

  minDate: Date;
  maxDate: Date;

  typeDocs = [{ key: "TI", value: "TI - Tarjeta de identidad" }, { key: "CC", value: "CC - Cédula de ciudadanía" }, { key: "CE", value: "CE - Cédula de extranjería" },
  { key: "PA", value: "PA - Pasaporte" }];

  especialCondition = ["Motriz o de movilidad", "Auditiva", "Visual", "Cognitiva", "Discapacidad Orgánica", "Otra", "Ninguna"];

  listEps = listEps;
  listAfp = listAfp;
  listSeverance = listSeverance;
  listCompensation = listCompensation;

  edit = false;

  constructor(private fb: FormBuilder, private session: SessionService, private snackbar: MatSnackBar, private collService: CollaboratorserviceService,
    public dialogRef: MatDialogRef<AddCollaboratorComponent>, private router: Router, private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // get id company to get info
    this.idComp = this.data.idComp;

    // set date to birthday
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 0, 1);
    this.maxDate = new Date(currentYear - 15, 11, 31);

    // init form
    this.initForm();

    if (this.data.flag === 'edit') {
      this.buildDataEdit();
    }

  }

  ngOnInit() { }

  initForm() {
    this.form = this.fb.group({
      idCol: [''],
      idComp: [this.idComp, Validators.required],
      identCol: ['', [Validators.required, Validators.min(9999999)]],
      docType: ['', [Validators.required]],
      nameCol: ['', Validators.required],
      lastnameCol: ['', Validators.required],
      birthdayCol: ['', Validators.required],
      area: ['', Validators.required],
      position: ['', Validators.required],
      rhCol: ['', Validators.required],
      genderCol: ['', Validators.required],
      specialCond: ['', Validators.required],
      otherCol: ['',],
      // socialSecCol: ['', Validators.required],
      eps: ['', Validators.required],
      othereps: ['',],
      afp: ['', Validators.required],
      otherafp: [''],
      otherarl: [''],
      severance_pay: ['', Validators.required],
      otherseverance_pay: [''],
      compensation_box: ['', Validators.required],
      othercompensation_box: ['']
    });
  }

  get f() { return this.form.controls; }

  saveUser() {

    this.buildDataOthers();

    const coll = new AcsCollaborator(this.form.value);
    this.loading = true;

    if (this.edit) {
      (this.collService.updateCol(coll)).pipe(
        finalize(() => {
          this.loading = false
          this.edit = false;
        })
      ).subscribe(() => this.addOk(), err => snackError(this.snackbar, err))
    }
    else {

      (this.collService.add(coll)).pipe(
        finalize(() => this.loading = false)
      ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
    }
  }

  addOk() {
    snackOk(this.snackbar, 'Usuario registrado');
    // this.router.navigate([`home/collaborators`], { relativeTo: this.route });
    this.dialogRef.close();
  }

  ChangeSpecialCond(ob) {
    if (ob.value === "Otra") {
      this.form.get("otherCol").setValidators([Validators.required]);
      this.form.get("otherCol").updateValueAndValidity();
    } else {
      this.form.get("otherCol").clearValidators();
      this.form.get("otherCol").updateValueAndValidity();
    }
  }

  changeOtherOption(obj: any) {
    const control = obj.source.ngControl.name; //this is the form name;
    const value = obj.value; //this is the value on this field;
    const fielControl = `other${control}`;

    if (value === 'OTRA') {
      this.form.get(fielControl).setValidators([Validators.required]);
      this.form.get(fielControl).updateValueAndValidity();
      console.log("poner validacion")

    } else {
      this.form.get(fielControl).clearValidators();
      this.form.get(fielControl).updateValueAndValidity();
    }

  }

  buildDataOthers() {
    if (this.form.get('othereps').value != '' && this.form.get('eps').value == 'OTRA') {
      this.form.controls['eps'].setValue(this.form.get('othereps').value);
    }

    if (this.form.get('otherafp').value != '' && this.form.get('afp').value == 'OTRA') {
      this.form.controls['afp'].setValue(this.form.get('otherafp').value);
    }

    if (this.form.get('otherseverance_pay').value != '' && this.form.get('severance_pay').value == 'OTRA') {
      this.form.controls['severance_pay'].setValue(this.form.get('otherseverance_pay').value);
    }

    if (this.form.get('othercompensation_box').value != '' && this.form.get('compensation_box').value == 'OTRA') {
      this.form.controls['compensation_box'].setValue(this.form.get('othercompensation_box').value);
    }

    console.log(this.form.value);
  }

  buildDataEdit() {
    this.edit = true;
    this.form.setValue(this.data.collaborator);
  }

}
