import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ActFormatSection } from '../../shared/models/actformatsection.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { FormsectionService } from '../../formsection/services/formsection.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-fs-dialog',
  templateUrl: './edit-fs-dialog.component.html',
  styleUrls: ['./edit-fs-dialog.component.scss']
})
export class EditFsDialogComponent implements OnInit {

  form: FormGroup;
  fs = new ActFormatSection();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditFsDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormsectionService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idFs: [this.data.id_fs, Validators.required],
      idFormat: [this.data.id_format, Validators.required],
      idSec: [this.data.id_sec, Validators.required],
      stateFs: [this.data.state_fs, Validators.required],
      orderFs: [this.data.order_fs, [Validators.required, Validators.max(9999)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editFs() {
    this.fs = new ActFormatSection(this.form.value);
    (this.service.edit(this.fs)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), (err) => snackError(this.snackbar, err));
  }

  editOk() {
    snackOk(this.snackbar, 'Sección actualizada');
    this.dialogRef.close();
  }

}
