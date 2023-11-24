import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActCondition } from '../../shared/models/actcondition.model';
import { PermitsService } from '../../core/services/permits.service';
import { ConditionsService } from '../services/conditions.service';
import { QuestionsService } from '../../questions/services/questions.service';
import { AddConditionDialogComponent } from '../add-condition-dialog/add-condition-dialog.component';
import { EditConditionDialogComponent } from '../edit-condition-dialog/edit-condition-dialog.component';
import { DelConditionDialogComponent } from '../del-condition-dialog/del-condition-dialog.component';

@Component({
  selector: 'app-list-conditions',
  templateUrl: './list-conditions.component.html',
  styleUrls: ['./list-conditions.component.scss']
})
export class ListConditionsComponent implements OnInit {

  data = new Array();
  dataQues = new Array();
  breadcrumb = new Array();
  nameQues: string;
  columnsCondition: string[] = ['type', 'message', 'actions'];
  dataSource: MatTableDataSource<ActCondition>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddConditionDialogComponent>;
  editDialogRef: MatDialogRef<EditConditionDialogComponent>;
  delDialogRef: MatDialogRef<DelConditionDialogComponent>;
  index: number;
  idQues: number;
  typeQues: string;

  constructor(private service: ConditionsService, public dialog: MatDialog, private activateRoute: ActivatedRoute,
    private serviceQues: QuestionsService, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idQues = params['id_ques'];
    });
    this.getQuestion();
    this.getConditions();
  }

  getQuestion() {
    this.serviceQues.quesById(this.idQues).subscribe(question => {
      this.dataQues = question[0];
      this.nameQues = this.dataQues['name_ques'];
      this.typeQues = this.dataQues['type_ques'];

        this.breadcrumb.push(
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/sections', name: 'Secciones' },
          { url: `../../../../home/questions/id_sec/${this.dataQues['id_sec']}`, name: `Preguntas ${this.dataQues['name_sec']}` },
          { url: '', name: `Condiciones ${this.nameQues}` }
        );
     
    });
  }

  getConditions() {
    this.service.listByIdQues(this.idQues).subscribe(conditions => {
      this.data = conditions;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getConditions();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddConditionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idQues: this.idQues, typeQues: this.typeQues }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getConditions();
    });
  }

  startEdit(i: number, idCond: number, idQues: number, typeCond: string, operatorCond: string, valueCond: string, messageCond: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditConditionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idCond, idQues, typeQues: this.typeQues, typeCond, operatorCond, valueCond, messageCond }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getConditions();
    });
  }

  startDelete(i: number, idCond: number, idQues: number, typeCond: string, operatorCond: string, valueCond: string, messageCond: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelConditionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idCond, idQues, typeCond, operatorCond, valueCond, messageCond }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getConditions();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
