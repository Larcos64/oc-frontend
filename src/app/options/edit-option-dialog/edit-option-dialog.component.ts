import { Component, OnInit, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OptionsService } from '../services/options.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActOption } from '../../shared/models/actoption.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { AddOptvalDialogComponent } from '../add-optval-dialog/add-optval-dialog.component';
import { EditOptvalDialogComponent } from '../edit-optval-dialog/edit-optval-dialog.component';
import { DelOptvalDialogComponent } from '../del-optval-dialog/del-optval-dialog.component';

@Component({
  selector: 'app-edit-option-dialog',
  templateUrl: './edit-option-dialog.component.html',
  styleUrls: ['./edit-option-dialog.component.scss']
})
export class EditOptionDialogComponent implements OnInit {

  form: FormGroup;
  option = new ActOption();
  loading = false;
  action = 'agregar';
  index: number;

  columnsOpValues: string[] = ['option', 'code', 'state', 'actions'];
  dataSource: MatTableDataSource<any>;
  dataOptValues = new Array();

  addOptValDialogRef: MatDialogRef<AddOptvalDialogComponent>;
  editOptValDialogRef: MatDialogRef<EditOptvalDialogComponent>;
  delOptValDialogRef: MatDialogRef<DelOptvalDialogComponent>;

  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditOptionDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: OptionsService, public servieOptVal: OptvaluesService) { }

  ngOnInit() {
    this.initForm();
    this.getOptValues();
  }

  initForm() {
    this.form = this.fb.group({
      idOption: [this.data.idOption, Validators.required],
      nameOption: [this.data.nameOption, [Validators.required, Validators.maxLength(200)]],
      descOption: [this.data.descOption, Validators.maxLength(300)],
      codOption: [this.data.codOption, Validators.maxLength(30)],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  getOptValues() {
    this.servieOptVal.listByIdOpt(this.data.idOption).subscribe(optvalues => {
      this.dataOptValues = optvalues;
      this.dataSource = new MatTableDataSource(this.dataOptValues);
    });
  }

  startAddOptVal(): void {
    this.addOptValDialogRef = this.dialog.open(AddOptvalDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { action: this.action, idOption: this.data.idOption }
    });

    this.addOptValDialogRef.afterClosed().subscribe(result => {
      // this.dataOptions[this.dataOptions.length] = { "nameOptValue": result[0]["nameOptValue"], "codOptValue": result[0]["codOptValue"], "stateOptValue": result[0]["stateOptValue"] };
      this.getOptValues();
    });
  }

  startEditOptVal(i: number, idOptValue: number, idOpt: number, nameOptValue: string, codOptValue: string, stateOptValue: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editOptValDialogRef = this.dialog.open(EditOptvalDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idOptValue, idOpt, nameOptValue, codOptValue, stateOptValue }
    });

    this.editOptValDialogRef.afterClosed().subscribe(result => {
      this.getOptValues();
    });
  }

  startDeleteOptVal(i: number, idOptValue: number, idOpt: number, nameOptValue: string, codOptValue: string, stateOptValue: string) {
    this.index = i;
    this.delOptValDialogRef = this.dialog.open(DelOptvalDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idOptValue, idOpt, nameOptValue, codOptValue, stateOptValue }
    });

    this.delOptValDialogRef.afterClosed().subscribe(result => {
      this.getOptValues();
    });
  }

  editOption() {
    this.option = new ActOption(this.form.value);
    this.loading = true;
    (this.service.edit(this.option)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), () => snackError(this.snackbar, 'Error al editar opción'));
  }

  editOk() {
    snackOk(this.snackbar, 'Opción actualizada');
    this.dialogRef.close();
  }

}
