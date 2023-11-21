import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsWorkplace } from '../../shared/models/acsworkpace.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { WorkplacesService } from '../services/workplaces.service';

@Component({
  selector: 'app-add-workplace-dialog',
  templateUrl: './add-workplace-dialog.component.html',
  styleUrls: ['./add-workplace-dialog.component.scss']
})
export class AddWorkplaceDialogComponent implements OnInit {

  form: FormGroup;
  workplace = new AcsWorkplace();
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private fb: FormBuilder, public service: WorkplacesService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddWorkplaceDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idComp: [this.data["idComp"], Validators.required],
      nameWorkplace: ['', Validators.required],
      addressWorkplace: [''],
      phoneWorkplace: ['', Validators.max(99999999999999)],
      fixed: ['', Validators.required],
      riskLvlWorkplace: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  saveWorkplace() {
    this.workplace = new AcsWorkplace(this.form.value);
    this.loading = true;
    (this.service.add(this.workplace)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Sitio de trabajo registrado');
    this.router.navigate([`home/workplaces/id_comp/${this.data["idComp"]}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
