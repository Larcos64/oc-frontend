import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { DependenciesService } from '../services/dependencies.service';

@Component({
  selector: 'app-del-dependency-dialog',
  templateUrl: './del-dependency-dialog.component.html',
  styleUrls: ['./del-dependency-dialog.component.scss']
})
export class DelDependencyDialogComponent implements OnInit {

  loading = false;

  constructor(public dialogRef: MatDialogRef<DelDependencyDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: DependenciesService) { }

  ngOnInit() {
  }

  deleteDependency() {
    (this.service.delete(parseInt(this.data.id_dep))).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar condición'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Condición eiminada');
    this.dialogRef.close();
  }

}
