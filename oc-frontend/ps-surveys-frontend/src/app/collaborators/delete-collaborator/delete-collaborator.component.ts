import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AcsCollaborator } from 'src/app/shared/models/acscollaborator.model';
import { CollaboratorserviceService } from '../services/collaboratorservice.service';
import { finalize } from 'rxjs/operators';
import { snackOk, snackError } from 'src/app/util/snackbar-util';

@Component({
  selector: 'app-delete-collaborator',
  templateUrl: './delete-collaborator.component.html',
  styleUrls: ['./delete-collaborator.component.scss']
})
export class DeleteCollaboratorComponent implements OnInit {

  loading = false;

  constructor(public dialogRef: MatDialogRef<DeleteCollaboratorComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public collaborator: AcsCollaborator, private Collservice: CollaboratorserviceService) { }

  ngOnInit() {
  }

  deleteUser() {
    (this.Collservice.deleteCollaborator(this.collaborator.idCol)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar usuario'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Usuario eliminado');
    // this.router.navigate([`home/users/id_comp/${this.data.idComp}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
