import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { SectionsService } from '../services/sections.service';

@Component({
  selector: 'app-del-section-dialog',
  templateUrl: './del-section-dialog.component.html',
  styleUrls: ['./del-section-dialog.component.scss']
})
export class DelSectionDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelSectionDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: SectionsService) { }

  ngOnInit() {
  }

  deleteSection() {
    (this.service.delete(this.data.idSection)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error, verifique que la sección no tenga preguntas, dependencias, asignaciones a formatos y versiones o diligenciamientos'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Sección eliminada');
    this.router.navigate(['home/sections'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
