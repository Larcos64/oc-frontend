import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormatsService } from '../services/formats.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActFormat } from '../../shared/models/actformat.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-format-dialog',
  templateUrl: './edit-format-dialog.component.html',
  styleUrls: ['./edit-format-dialog.component.scss']
})
export class EditFormatDialogComponent implements OnInit {

  form: FormGroup;
  format = new ActFormat();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditFormatDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: FormatsService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idFormat: [this.data.idFormat, Validators.required],
      idUser: [this.data.idUser, Validators.required],
      nameFormat: [this.data.nameFormat, [Validators.required, Validators.maxLength(100)]],
      descFormat: [this.data.descFormat, Validators.maxLength(300)],
      typeFormat: [this.data.typeFormat, Validators.maxLength(10)],
      codFormat: [this.data.codFormat, [Validators.required, Validators.maxLength(30)]],
      issueDate: [this.data.issueDate, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editFormat() {
    this.format = new ActFormat(this.form.value);
    this.loading = true;
    (this.service.edit(this.format)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar formato'));
  }

  editOk() {
    snackOk(this.snackbar, 'Formato actualizado');
    this.router.navigate(['home/formats'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
