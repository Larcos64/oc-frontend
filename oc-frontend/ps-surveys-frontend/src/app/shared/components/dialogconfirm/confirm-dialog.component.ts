import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  loading = false;
  title: string = 'Eliminar'
  message: string = '¿Esta seguro que desea eliminar este registro?'

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.title) {
      this.title = data.title
    }
    if (data.message) {
      this.message = data.message
    }
  }

  ngOnInit() {
  }

  accept() {
    this.dialogRef.close(this.data)
  }



}
