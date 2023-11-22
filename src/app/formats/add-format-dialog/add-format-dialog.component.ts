import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { ActFormat } from '../../shared/models/actformat.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { FormatsService } from '../services/formats.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-add-format-dialog',
  templateUrl: './add-format-dialog.component.html',
  styleUrls: ['./add-format-dialog.component.scss']
})
export class AddFormatDialogComponent implements OnInit {

  form: FormGroup;
  format = new ActFormat();
  loading = false;

  constructor(private router: Router, private fb: FormBuilder, public service: FormatsService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddFormatDialogComponent>,
    private session: SessionService) { }

  ngOnInit() {
    this.initForm();
    // console.log("ACÁ: ", this.session);
  }

  initForm() {
    this.form = this.fb.group({
      idUser:  [parseInt(this.session.idUser), Validators.required],
      nameFormat: ['', [Validators.required, Validators.maxLength(100)]],
      descFormat: ['', Validators.maxLength(300)],
      typeFormat: ['', Validators.maxLength(10)],
      codFormat:  ['', [Validators.required, Validators.maxLength(30)]],
      issueDate:  ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  saveFormat() {
    this.format = new ActFormat(this.form.value);
    this.loading = true;
    (this.service.add(this.format)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Formato registrado');
    this.router.navigate([`home/formats`], { relativeTo: this.route });
    this.dialogRef.close();
  }

}
