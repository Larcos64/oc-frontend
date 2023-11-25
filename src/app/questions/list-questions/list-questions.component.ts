import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActQues } from '../../shared/models/actquestion.model';
import { PermitsService } from '../../core/services/permits.service';
import { QuestionsService } from '../services/questions.service';
import { SectionsService } from '../../sections/services/sections.service';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';
import { EditQuestionDialogComponent } from '../edit-question-dialog/edit-question-dialog.component';
import { DelQuestionDialogComponent } from '../del-question-dialog/del-question-dialog.component';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss']
})
export class ListQuestionsComponent implements OnInit {

  data = new Array();
  dataSec = new Array();
  breadcrumb = new Array();
  nameSection: string;
  columnsQuestion: string[] = ['ques', 'desc', 'mand','order', 'actions'];
  dataSource: MatTableDataSource<ActQues>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddQuestionDialogComponent>;
  editDialogRef: MatDialogRef<EditQuestionDialogComponent>;
  delDialogRef: MatDialogRef<DelQuestionDialogComponent>;
  index: number;
  idSec: number;

  permTerms = this.servicePermits.validatePermit('Secciones.preguntas.condiciones');
  permDependencies = this.servicePermits.validatePermit('Secciones.preguntas.dependencias');
  permCreate = this.servicePermits.validatePermit('Secciones.preguntas.crear');
  permEdit = this.servicePermits.validatePermit('Secciones.preguntas.editar');
  permDel = this.servicePermits.validatePermit('Secciones.preguntas.eliminar');

  constructor(private service: QuestionsService, public dialog: MatDialog, private activateRoute: ActivatedRoute,
    private router: Router, private serviceSec: SectionsService, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idSec = params["id_sec"];
    });
    this.getSection();
    this.getQuestions();
  }

  getSection() {
    this.serviceSec.secById(this.idSec).subscribe(section => {
      this.dataSec = section;
      this.nameSection = this.dataSec["nameSection"];
        this.breadcrumb.push(
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/sections', name: 'Secciones' },
        { url: '', name: `Preguntas ${this.nameSection}` },
        );
    });
  }

  getQuestions() {
    this.service.listByIdSec(this.idSec).subscribe(questions => {
      this.data = questions;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getQuestions();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddQuestionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idSec: this.idSec }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getQuestions();
    });
  }

  startEdit(i: number, idQues: number, idSec: number, idOpt: number, nameQues: string, descQues: string, typeQues: string,
    infoQues: string, mandatoryQues: string, itemValue:number, orderQues:number) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditQuestionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idQues, idSec, idOpt, nameQues, descQues, typeQues, infoQues, mandatoryQues, itemValue, orderQues }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getQuestions();
    });
  }

  startDelete(i: number, idQues: number, idSec: number, nameQues: string, descQues: string, mandatoryQues: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelQuestionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idQues, idSec, nameQues, descQues, mandatoryQues }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getQuestions();
    });
  }

  viewConditions(idQues: number) {
    this.router.navigate(["home/conditions/id_ques", idQues]);
  }

  viewDependencies(idQues: number) {
    this.router.navigate(["home/dependencies/id_ques", idQues]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
