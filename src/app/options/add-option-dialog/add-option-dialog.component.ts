import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ActOption } from '../../shared/models/actoption.model';
import { ActOptionValue } from '../../shared/models/actoptionvalue.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { OptionsService } from '../services/options.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';
import { AddOptvalDialogComponent } from '../add-optval-dialog/add-optval-dialog.component';

@Component({
  selector: 'app-add-option-dialog',
  templateUrl: './add-option-dialog.component.html',
  styleUrls: ['./add-option-dialog.component.scss']
})
export class AddOptionDialogComponent implements OnInit {

  form: FormGroup;
  option = new ActOption();
  optval = new ActOptionValue();
  loading = false;
  action = 'anadir';

  dataOptVal = {};
  dataOptValues = new Array();
  columnsOpValues: string[] = ['option', 'code', 'state', 'actions'];
  dataSource: MatTableDataSource<any>;

  addOptValDialogRef: MatDialogRef<AddOptvalDialogComponent>;

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, public service: OptionsService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddOptionDialogComponent>,
    private serviceOptVal: OptvaluesService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nameOption: ['', [Validators.required, Validators.maxLength(200)]],
      descOption: ['', Validators.maxLength(300)],
      codOption: ['', Validators.maxLength(30)],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getOptValues() {
    this.dataSource = new MatTableDataSource(this.dataOptValues);
  }

  startAddOpt(): void {
    this.addOptValDialogRef = this.dialog.open(AddOptvalDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { action: this.action }
    });

    this.addOptValDialogRef.afterClosed().subscribe(result => {
      this.dataOptValues[this.dataOptValues.length] = { "nameOptValue": result[0]["nameOptValue"], "codOptValue": result[0]["codOptValue"], "stateOptValue": result[0]["stateOptValue"] };
      this.getOptValues();
    });
  }

  saveOption() {
    this.option = new ActOption(this.form.value);
    this.loading = true;
    (this.service.add(this.option)).pipe(
      finalize(() => this.loading = false)
    ).subscribe((res) => this.buildOptValues(res), (err) => snackError(this.snackbar, err));
  }

  buildOptValues(dataOption) {
    for (const opt of this.dataOptValues) {
      this.dataOptVal = {
        idOpt: dataOption.idOption,
        nameOptValue: opt.nameOptValue,
        codOptValue: opt.codOptValue,
        stateOptValue: opt.stateOptValue
      };

      this.saveOptValues(this.dataOptVal);
    }
  }

  deleteOption(index: number) {
    this.dataOptValues.splice(index, 1);
    this.getOptValues();
  }

  saveOptValues(object) {
    this.optval = new ActOptionValue(object);
    (this.serviceOptVal.add(this.optval)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Opciones registradas');
    this.dialogRef.close();
  }

}
