import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AcsWorkplace } from '../../shared/models/acsworkpace.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { WorkplacesService } from '../services/workplaces.service';

@Component({
  selector: 'app-edit-workplace-dialog',
  templateUrl: './edit-workplace-dialog.component.html',
  styleUrls: ['./edit-workplace-dialog.component.scss']
})
export class EditWorkplaceDialogComponent implements OnInit {

  form: FormGroup;
  workplace = new AcsWorkplace();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditWorkplaceDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: WorkplacesService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idWorkplace: [this.data["idWorkplace"], Validators.required],
      idComp: [this.data["idComp"], Validators.required],
      nameWorkplace: [this.data["nameWorkplace"], Validators.required],
      addressWorkplace: [this.data["addressWorkplace"]],
      phoneWorkplace: [this.data["phoneWorkplace"], Validators.max(99999999999999)],
      fixed: [this.data["fixed"], Validators.required],
      riskLvlWorkplace: [this.data["riskLvlWorkplace"].toString(), Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editWorkplace() {
    this.workplace = new AcsWorkplace(this.form.value);
    (this.service.edit(this.workplace)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(), (err) => snackError(this.snackbar, err));
  }

  editOk() {
    snackOk(this.snackbar, 'Sitio de trabajo actualizado');
    this.router.navigate([`home/workplaces/id_comp/${this.data["idComp"]}`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
