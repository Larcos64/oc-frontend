import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';

@Component({
  selector: 'app-del-optval-dialog',
  templateUrl: './del-optval-dialog.component.html',
  styleUrls: ['./del-optval-dialog.component.scss']
})
export class DelOptvalDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelOptvalDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: OptvaluesService) { }

  ngOnInit() {
  }

  deleteOptValue() {
    (this.service.delete(this.data.idOptValue)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar valor de opción'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Valor de opción eliminado');
    this.dialogRef.close();
  }

}
