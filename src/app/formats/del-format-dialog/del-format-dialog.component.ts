import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { FormatsService } from '../services/formats.service';

@Component({
  selector: 'app-del-format-dialog',
  templateUrl: './del-format-dialog.component.html',
  styleUrls: ['./del-format-dialog.component.scss']
})
export class DelFormatDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelFormatDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: FormatsService) { }

  ngOnInit() {
  }

  deleteFormat() {
    (this.service.delete(this.data.idFormat)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error, verifique que el formato no tenga secciones, versiones, asignaciones a empresas o diligenciamientos'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Formato eliminado');
    this.router.navigate(['home/formats'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
