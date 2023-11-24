import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ActOptionValue } from '../../shared/models/actoptionvalue.model';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';

@Component({
  selector: 'app-add-optval-dialog',
  templateUrl: './add-optval-dialog.component.html',
  styleUrls: ['./add-optval-dialog.component.scss']
})
export class AddOptvalDialogComponent implements OnInit {

  form: FormGroup;
  optvalue = new ActOptionValue();
  loading = false;
  data = new Array();
  action = this.dataAction.action;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddOptvalDialogComponent>, public service: OptvaluesService,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public dataAction: any) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idOpt: [''],
      nameOptValue: ['', [Validators.required, Validators.maxLength(200)]],
      codOptValue: ['', Validators.maxLength(20)],
      stateOptValue: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  addOption(): void {
    this.data = new Array(this.form.value);
    this.dialogRef.close(this.data);
  }

  saveOptValue() {
    if (this.dataAction.idOption) {
      this.form.get('idOpt').setValue(this.dataAction.idOption);
    }
    this.optvalue = new ActOptionValue(this.form.value);
    this.loading = true;
    (this.service.add(this.optvalue)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Valor de opción registrado');
    // this.router.navigate([`home/formats`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
