import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsProfile } from '../../shared/models/acsprofile.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-add-profile-dialog',
  templateUrl: './add-profile-dialog.component.html',
  styleUrls: ['./add-profile-dialog.component.scss']
})
export class AddProfileDialogComponent implements OnInit {

  form: FormGroup;
  profile = new AcsProfile();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public service: ProfilesService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddProfileDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nameProf: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  saveProfile() {
    this.profile = new AcsProfile(this.form.value);
    // console.log("DATA: ", this.form.value);
    // console.log("OBJECT: ", this.profile);
    (this.service.add(this.profile)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Perfil registrado');
    this.router.navigate(['home/profiles'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
