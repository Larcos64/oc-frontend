import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ConditionsService } from '../services/conditions.service';

@Component({
  selector: 'app-del-condition-dialog',
  templateUrl: './del-condition-dialog.component.html',
  styleUrls: ['./del-condition-dialog.component.scss']
})
export class DelConditionDialogComponent implements OnInit {

  loading = false;

  constructor(public dialogRef: MatDialogRef<DelConditionDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: ConditionsService) { }

  ngOnInit() {
  }

  deleteCondition() {
    (this.service.delete(this.data.idCond)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar dependencia'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Dependencia eiminada');
    this.dialogRef.close();
  }

}
