import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { PermissionsService } from '../services/permissions.service';

@Component({
  selector: 'app-del-permission-dialog',
  templateUrl: './del-permission-dialog.component.html',
  styleUrls: ['./del-permission-dialog.component.scss']
})
export class DelPermissionDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelPermissionDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: PermissionsService) { }

  ngOnInit() {
  }

  deletePermission() {
    (this.service.delete(this.data.idPermis)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar permiso'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Permiso eliminado');
    this.router.navigate(['home/permissions'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
