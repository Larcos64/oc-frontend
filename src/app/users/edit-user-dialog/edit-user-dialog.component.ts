import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AcsUser } from '../../shared/models/acsuser.model';
import { MustMatch } from '../add-user-dialog/add-user-validator';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UsersService } from '../services/users.service';
import { ProfilesService } from '../../profiles/services/profiles.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {

  form: FormGroup;
  profiles = new Array();
  companies = new Array();
  user = new AcsUser();
  hide1 = true;
  hide2 = true;
  loading = false;
  changepass = false;
  chPass: number;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: UsersService,
    public profService: ProfilesService) {
    // console.log("VEA: ", this.data);
  }

  ngOnInit() {
    this.initForm();
    this.getProfiles();
    this.getCompanies();
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
      passUser: [{ value: '', disabled: true }],
      passUser2: [{ value: '', disabled: true }],
      rhUser: [this.data.rhUser, Validators.required],
      genderUser: [this.data.genderUser, Validators.required],
      dateBirthUser: [this.data.dateBirthUser, Validators.required],
      entailmentDateUser: [this.data.entailmentDateUser, Validators.required]
    }, {
      validator: MustMatch('passUser', 'passUser2')
    });
  }

  onChange(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.changepass = true;
      // this.form.get("passUser").setValue('');
      this.form.get('passUser').setValidators([Validators.required]);
      this.form.get('passUser').enable();
      this.form.get('passUser').updateValueAndValidity();
      // this.form.get("passUser2").setValue('');
      this.form.get('passUser2').enable();
      this.form.get('passUser2').setValidators([Validators.required]);
      this.form.get('passUser2').updateValueAndValidity();
    } else {
      this.changepass = false;
      // this.form.get("passUser").setValue(this.data["passUser"]);
      this.form.get('passUser').clearValidators();
      this.form.get('passUser').disable();
      this.form.get('passUser').updateValueAndValidity();
      // this.form.get("passUser2").setValue(this.data["passUser"]);
      this.form.get('passUser2').clearValidators();
      this.form.get('passUser2').disable();
      this.form.get('passUser2').updateValueAndValidity();
    }
    // let matSlideToggle: MatSlideToggle = ob.source;
    // console.log(matSlideToggle.color);
    // console.log(matSlideToggle.required);
  }


  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getProfiles() {
    this.profService.list().subscribe(prof => {
      this.profiles = prof;
    });
  }

  getCompanies() {
    this.service.listCompanies().subscribe(comp => {
      this.companies = comp;
    });
  }

  editUser() {
    this.user = new AcsUser(this.form.value);
    if (this.changepass) {
      this.chPass = 1;
    } else {
      this.chPass = 0;
    }
    (this.service.edit(this.user, this.chPass)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar usuario'));
  }

  editOk() {
    snackOk(this.snackbar, 'Usuario actualizado');
    this.router.navigate([`home/users/id_comp/${this.data.idComp}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
