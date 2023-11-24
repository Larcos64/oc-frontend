import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { WorkplacesService } from '../services/workplaces.service';

@Component({
  selector: 'app-del-workarea-dialog',
  templateUrl: './del-workarea-dialog.component.html',
  styleUrls: ['./del-workarea-dialog.component.scss']
})
export class DelWorkplaceDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelWorkplaceDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: WorkplacesService) { }

  ngOnInit() {
  }

  deleteWorkplace() {
    (this.service.delete(this.data.idWorkplace)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar empresa'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Sitio de trabajo eliminado');
    this.router.navigate([`home/workarea/id_comp/${this.data.idComp}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
