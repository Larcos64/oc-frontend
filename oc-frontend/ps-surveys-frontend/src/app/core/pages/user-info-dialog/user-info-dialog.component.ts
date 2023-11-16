import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AcsUser } from '../../../shared/models/acsuser.model';
import { snackError, snackOk } from '../../../util/snackbar-util';
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrls: ['./user-info-dialog.component.scss']
})
export class UserInfoDialogComponent implements OnInit {

  form: FormGroup;
  profiles = new Array();
  companies = new Array();
  user = new AcsUser();
  hide1 = true;
  hide2 = true;
  loading = false;
  changepass = false;
  chPass: number;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: UsersService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idUser: [this.data.idUser, Validators.required],
      idProf: [this.data.idProf, Validators.required],
      idComp: [this.data.idComp, Validators.required],
      identUser: [this.data.identUser, [Validators.required, Validators.min(9999999)]],
      nameUser: [this.data.nameUser, Validators.required],
      lastnameUser: [this.data.lastnameUser, Validators.required],
      emailUser: [this.data.emailUser, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      rhUser: [this.data.rhUser, Validators.required],
      genderUser: [this.data.genderUser, Validators.required],
      dateBirthUser: [this.data.dateBirthUser, Validators.required],
      entailmentDateUser: [this.data.entailmentDateUser, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editInfo() {
    this.user = new AcsUser(this.form.value);
    (this.service.edit(this.user, 0)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar perfil'));
  }

  editOk() {
    snackOk(this.snackbar, 'Perfil actualizado, por favor espere...');
    window.location.reload();
    this.dialogRef.close();
  }
}
