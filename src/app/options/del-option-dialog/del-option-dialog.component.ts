import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { OptionsService } from '../services/options.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';

@Component({
  selector: 'app-del-option-dialog',
  templateUrl: './del-option-dialog.component.html',
  styleUrls: ['./del-option-dialog.component.scss']
})
export class DelOptionDialogComponent implements OnInit {

  loading = false;

  constructor(public dialogRef: MatDialogRef<DelOptionDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: OptionsService, public serviceOptVal: OptvaluesService) { }

  ngOnInit() {
  }

  deleteOption() {
    this.loading = true;
    this.delOptValByIdOpt(this.data.idOption);
    setTimeout(() => {
      (this.service.delete(this.data.idOption)).pipe(
        finalize(() => this.loading = false)
      ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar opción'));
    }, 1000);
  }

  deleteOk() {
    snackOk(this.snackbar, 'Opción eliminada');
    this.dialogRef.close();
  }

  delOptValByIdOpt(idOption) {
    (this.serviceOptVal.deleteByIdOpt(idOption)).pipe(
      finalize(() => this.loading = true)
    ).subscribe(() => this.loading = true, (err) => snackError(this.snackbar, err));
  }

}
