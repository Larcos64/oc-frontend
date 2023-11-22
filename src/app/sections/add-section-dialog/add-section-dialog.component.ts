import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { ActSection } from '../../shared/models/actsection.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { SectionsService } from '../services/sections.service';

@Component({
  selector: 'app-add-section-dialog',
  templateUrl: './add-section-dialog.component.html',
  styleUrls: ['./add-section-dialog.component.scss']
})
export class AddSectionDialogComponent implements OnInit {

  form: FormGroup;
  section = new ActSection();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public service: SectionsService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddSectionDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nameSection: ['', [Validators.required, Validators.maxLength(200)]],
      descSection: ['', Validators.maxLength(200)],
      typeSection: ['', Validators.maxLength(10)],
      tableName:   ['default_table', [Validators.required, Validators.maxLength(20)]],
      cycle:       ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  saveSection() {
    this.section = new ActSection(this.form.value);
    this.loading = true;
    (this.service.add(this.section)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Sección registrada');
    this.router.navigate([`home/sections`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
