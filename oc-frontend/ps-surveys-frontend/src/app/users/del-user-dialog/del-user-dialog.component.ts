import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-del-user-dialog',
  templateUrl: './del-user-dialog.component.html',
  styleUrls: ['./del-user-dialog.component.scss']
})
export class DelUserDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelUserDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: UsersService) { }

  ngOnInit() {
  }

  deleteUser() {
    (this.service.delete(this.data.idUser)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar usuario'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Usuario eliminado');
    this.router.navigate([`home/users/id_comp/${this.data.idComp}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
