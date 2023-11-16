import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfilesService } from '../services/profiles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcsProfile } from '../../shared/models/acsprofile.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {

  form: FormGroup;
  user = new AcsProfile();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ProfilesService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idProf: [this.data["idProf"], Validators.required],
      nameProf: [this.data["nameProf"], Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editProfile() {
    this.user = new AcsProfile(this.form.value);
    this.loading = true;
    (this.service.edit(this.user)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar perfil'));
  }

  editOk() {
    snackOk(this.snackbar, 'Perfil actualizado');
    this.router.navigate(['home/profiles'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
