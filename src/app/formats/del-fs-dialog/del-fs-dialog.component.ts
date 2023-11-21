import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { FormsectionService } from '../../formsection/services/formsection.service';

@Component({
  selector: 'app-del-fs-dialog',
  templateUrl: './del-fs-dialog.component.html',
  styleUrls: ['./del-fs-dialog.component.scss']
})
export class DelFsDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelFsDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: FormsectionService) { }

  ngOnInit() {
  }

  deleteFs() {
    (this.service.delete(this.data.id_fs)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar sección'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Sección eliminada');
    this.dialogRef.close();
  }

}
