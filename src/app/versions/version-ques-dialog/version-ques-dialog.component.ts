import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { VersionSectionService } from '../services/versionssection.service';
import { finalize } from 'rxjs/operators';
import { snackError, snackOk } from 'src/app/util/snackbar-util';
import { MatSnackBar, MatSelectChange } from '@angular/material';
import { ActVersionQues } from 'src/app/shared/models/actversionques.model';
import { VersionsQuesService } from '../services/versionsques.service';
import { ActQues } from 'src/app/shared/models/actquestion.model';

@Component({
  selector: 'app-version-ques-dialog',
  templateUrl: './version-ques-dialog.component.html'
})
export class VersionQuesDialogComponent implements OnInit {

  dataFs = new Array();
  columnsFs: string[] = ['nameSec', 'nameQues', 'actions'];
  dataSource: MatTableDataSource<ActVersionQues>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  index: number;

  questions = new Array()
  questionsAll = new Array()
  questionSelects = new Array()

  sectionSelect: any
  sections = new Array()
  sectionsAll = new Array()

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<VersionQuesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: VersionsQuesService, private snackbar: MatSnackBar,
    private sectionsService: VersionSectionService) { }

  ngOnInit() {
    this.getSections()
    this.getVersionQuestions()
  }

  getSections() {
    this.sectionsService.listByIdVersionInfoSection(this.data.version.idVersion).subscribe(sections => {
      this.sections = sections;
      this.sectionsAll = sections;
    });
  }

  getVersionQuestions() {
    this.service.listByIdVersionInfoSection(this.data.version.idVersion).subscribe(questions => {
      this.dataFs = questions;
      this.dataSource = new MatTableDataSource(this.dataFs);
      this.dataSource.paginator = this.paginator;
    });
  }

  searchQuestions($event: MatSelectChange) {
    this.questions = []
    this.service.listQuesNoVersion(this.data.version.idVersion, this.sectionSelect.id_sec)
      .subscribe(lst => {
        if (lst.length == 0) {
          this.questions.push({ idQues: 0, nameQues: 'No hay preguntas' })
        } else {
          this.questions = lst
          this.questionsAll = lst
        }
      });
  }

  refresh() {
    this.getVersionQuestions();
    this.questionSelects = []
    this.sectionSelect = null
  }

  startDelete(i: number, element: any) {
    this.index = i;
    this.sectionSelect = null
    this.service.delete(element.id_ver_ques)
      .pipe(finalize(() => this.refresh()))
      .subscribe(() => snackOk(this.snackbar, 'Pregunta eliminada correctamente'), (err) => snackError(this.snackbar, err));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilterSection(val, type) {
    if (type == 'S') {
      this.sections = this.sectionsAll.filter((unit) => {
        return unit.name_sec.toLowerCase().indexOf(val.toLowerCase()) > -1
      });
    } else {
      this.questions = this.questionsAll.filter((unit) => {
        return unit.nameQues.toLowerCase().indexOf(val.toLowerCase()) > -1
      });
    }

  }

  addQuestions() {
    // this.loading = true;
    if (this.questionSelects.length == 1 && this.questionSelects[0].idQues == 0)
      snackError(this.snackbar, 'Debe seleccionar preguntas validas')
    else
      this.service.addQuestions(this.questionSelects, this.data.version.idVersion)
        .pipe(
          finalize(() => this.refresh())
        )
        .subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }
  addOk() {
    snackOk(this.snackbar, 'Preguntas registradas correctamente')
  }

}
