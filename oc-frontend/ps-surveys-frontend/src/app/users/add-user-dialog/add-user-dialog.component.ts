import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsUser } from '../../shared/models/acsuser.model';
import { MustMatch } from './add-user-validator';
import { snackError, snackOk } from '../../util/snackbar-util';
import { UsersService } from '../services/users.service';
import { ProfilesService } from '../../profiles/services/profiles.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  form: FormGroup;
  profiles = new Array();
  companies = new Array();
  user = new AcsUser();
  hide1 = true;
  hide2 = true;
  loading = false;

  // email = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private fb: FormBuilder, public service: UsersService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddUserDialogComponent>,
    public profService: ProfilesService) {
  }

  ngOnInit() {
    this.initForm();
    this.getProfiles();
    this.getCompanies();
  }

  initForm() {
    this.form = this.fb.group({
      idProf: ['', Validators.required],
      idComp: [this.data.idComp, Validators.required],
      identUser: ['', [Validators.required, Validators.min(9999999)]],
      nameUser: ['', Validators.required],
      lastnameUser: ['', Validators.required],
      emailUser: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      passUser: ['', Validators.required],
      passUser2: ['', Validators.required],
      rhUser: ['', Validators.required],
      genderUser: ['', Validators.required],
      dateBirthUser: ['', Validators.required],
      entailmentDateUser: ['', Validators.required]
    }, {
      validator: MustMatch('passUser', 'passUser2')
    });
  }

  /* Handle form errors in Angular 8 */
  // public errorHandling = (control: string, error: string) => {
  //   return this.form.controls[control].hasError(error);
  // }

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

  saveUser() {
    // let name = this.form.get('name').value;
    this.user = new AcsUser(this.form.value);
    this.loading = true;
    (this.service.add(this.user)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Usuario registrado');
    this.router.navigate([`home/users/id_comp/${this.data["idComp"]}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

  // validateForm() {
  //   if (this.email.hasError('required')) {
  //     return 'Debe ingresar el correo';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }

}
