import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsWorkplace } from '../../shared/models/acsworkpace.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { WorkplacesService } from '../services/workplaces.service';

@Component({
  selector: 'app-add-workarea-dialog',
  templateUrl: './add-workarea-dialog.component.html',
  styleUrls: ['./add-workarea-dialog.component.scss']
})
export class AddWorkplaceDialogComponent implements OnInit {

  form: FormGroup;
  workarea = new AcsWorkplace();
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private fb: FormBuilder, public service: WorkplacesService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddWorkplaceDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idComp: [this.data["idComp"], Validators.required],
      nameWorkplace: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  saveWorkplace() {
    this.workarea = new AcsWorkplace(this.form.value);
    this.loading = true;
    (this.service.add(this.workarea)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Sitio de trabajo registrado');
    this.router.navigate([`home/workarea/id_comp/${this.data["idComp"]}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
