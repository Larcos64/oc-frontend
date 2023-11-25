import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { QuestionsService } from '../services/questions.service';

@Component({
  selector: 'app-del-question-dialog',
  templateUrl: './del-question-dialog.component.html',
  styleUrls: ['./del-question-dialog.component.scss']
})
export class DelQuestionDialogComponent implements OnInit {

  loading = false;

  constructor(public dialogRef: MatDialogRef<DelQuestionDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: QuestionsService) { }

  ngOnInit() {
  }

  deleteQuestion() {
    (this.service.delete(this.data.idQues, this.data.idSec)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.deleteOk(), () => snackError(this.snackbar, 'Error, verifique que la pregunta no tenga condiciones, dependencias y asignación a una versiones'));
  }

  deleteOk() {
    snackOk(this.snackbar, 'Pregunta eliminada');
    this.dialogRef.close();
  }

}
