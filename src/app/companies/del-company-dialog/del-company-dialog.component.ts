import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { CompaniesService } from '../services/companies.service';

@Component({
  selector: 'app-del-company-dialog',
  templateUrl: './del-company-dialog.component.html',
  styleUrls: ['./del-company-dialog.component.scss']
})
export class DelCompanyDialogComponent implements OnInit {

  loading = false;

  constructor(private router: Router, public dialogRef: MatDialogRef<DelCompanyDialogComponent>, private snackbar: MatSnackBar,
    private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public service: CompaniesService) { }

  ngOnInit() {
  }

  deleteCompany() {
    (this.service.delete(this.data.idComp)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error al eliminar empresa'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Empresa eliminada');
    this.router.navigate(['home/companies'], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
