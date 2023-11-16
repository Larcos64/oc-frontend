import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { ProfilesService } from '../services/profiles.service';
import { PermisrolService } from '../../permisrol/services/permisrol.service';

@Component({
  selector: 'app-del-profile-dialog',
  templateUrl: './del-profile-dialog.component.html',
  styleUrls: ['./del-profile-dialog.component.scss']
})
export class DelProfileDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelProfileDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: ProfilesService,
    public servicePermRol: PermisrolService) { }

  ngOnInit() {
  }

  deleteProfile() {
    this.delPermissionsByIdProf(this.data.idProf);
    (this.service.delete(this.data.idProf)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar perfil'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Perfil eliminado');
    this.router.navigate(['home/profiles'], { relativeTo: this.route });
    this.dialogRef.close();
  }

  delPermissionsByIdProf(idProf) {
    (this.servicePermRol.deleteByIdProf(idProf)).pipe(
      finalize(() => this.loading = true)
    ).subscribe(() => this.loading = false, (err) => snackError(this.snackbar, err));
  }

}
