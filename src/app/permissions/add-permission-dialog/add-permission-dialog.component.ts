import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsPermission } from '../../shared/models/acspermission.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { PermissionsService } from '../services/permissions.service';

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.scss']
})
export class AddPermissionDialogComponent implements OnInit {

  form: FormGroup;
  permission = new AcsPermission();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public service: PermissionsService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddPermissionDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      namePermis: ['', Validators.required],
      desPermis: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  savePermission() {
    this.permission = new AcsPermission(this.form.value);
    (this.service.add(this.permission)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Permiso registrado');
    this.router.navigate(['home/permissions'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
