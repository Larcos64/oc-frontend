import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OptionsService } from '../services/options.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActOption } from '../../shared/models/actoption.model';
import { ActOptionValue } from '../../shared/models/actoptionvalue.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { AddOptvalDialogComponent } from '../add-optval-dialog/add-optval-dialog.component';

@Component({
  selector: 'app-edit-optval-dialog',
  templateUrl: './edit-optval-dialog.component.html',
  styleUrls: ['./edit-optval-dialog.component.scss']
})
export class EditOptvalDialogComponent implements OnInit {

  form: FormGroup;
  optvalue = new ActOptionValue();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditOptvalDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: OptvaluesService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idOptValue: [this.data.idOptValue, Validators.required],
      idOpt: [this.data.idOpt],
      nameOptValue: [this.data.nameOptValue, [Validators.required, Validators.maxLength(200)]],
      codOptValue: [this.data.codOptValue, [Validators.required, Validators.maxLength(20)]],
      stateOptValue: [this.data.stateOptValue, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editOptValue() {
    this.optvalue = new ActOptionValue(this.form.value);
    this.loading = true;
    (this.service.edit(this.optvalue)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar valor de opción'));
  }

  editOk() {
    snackOk(this.snackbar, 'Valor de opción actualizado');
    this.dialogRef.close();
  }

}
