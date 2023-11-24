import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-add-option-dialog',
  templateUrl: './add-option-dialog.component.html',
  styleUrls: ['./add-option-dialog.component.scss']
})
export class AddOptionDialogComponent implements OnInit {

  form: FormGroup;
  loading = false;
  data = new Array();

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddOptionDialogComponent>) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nameOptValue: ['', [Validators.required, Validators.maxLength(200)]],
      codOptValue: ['', [Validators.required, Validators.maxLength(20)]],
      stateOptValue: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  addOption(): void {
    this.data = new Array(this.form.value);
    this.dialogRef.close(this.data);
  }

}
