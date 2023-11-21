import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermissionsService } from '../services/permissions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcsPermission } from '../../shared/models/acspermission.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-permission-dialog',
  templateUrl: './edit-permission-dialog.component.html',
  styleUrls: ['./edit-permission-dialog.component.scss']
})
export class EditPermissionDialogComponent implements OnInit {

  form: FormGroup;
  permission = new AcsPermission();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditPermissionDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: PermissionsService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idPermis: [this.data["idPermis"], Validators.required],
      namePermis: [this.data["namePermis"], Validators.required],
      desPermis: [this.data["desPermis"]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editPermission() {
    this.permission = new AcsPermission(this.form.value);
    this.loading = true;
    (this.service.edit(this.permission)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar permiso'));
  }

  editOk() {
    snackOk(this.snackbar, 'Permiso actualizado');
    this.router.navigate(['home/permissions'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
