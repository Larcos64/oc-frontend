import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActDependency } from '../../shared/models/actdependency.model';
import { PermitsService } from '../../core/services/permits.service';
import { DependenciesService } from '../services/dependencies.service';
import { QuestionsService } from '../../questions/services/questions.service';
import { SectionsService } from '../../sections/services/sections.service';
import { AddDependencyDialogComponent } from '../add-dependency-dialog/add-dependency-dialog.component';
import { EditDependencyDialogComponent } from '../edit-dependency-dialog/edit-dependency-dialog.component';
import { DelDependencyDialogComponent } from '../del-dependency-dialog/del-dependency-dialog.component';

@Component({
  selector: 'app-list-dependencies',
  templateUrl: './list-dependencies.component.html',
  styleUrls: ['./list-dependencies.component.scss']
})
export class ListDependenciesComponent implements OnInit {

  data = new Array();
  dataQues = new Array();
  dataSec = new Array();
  breadcrumb = new Array();
  nameChild: string;
  columnsDependency: string[] = ['ques', 'actions'];
  dataSource: MatTableDataSource<ActDependency>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddDependencyDialogComponent>;
  editDialogRef: MatDialogRef<EditDependencyDialogComponent>;
  delDialogRef: MatDialogRef<DelDependencyDialogComponent>;
  index: number;
  idQues: number;
  idSec: number;

  constructor(private service: DependenciesService, public dialog: MatDialog, private activateRoute: ActivatedRoute,
    private serviceQues: QuestionsService, private serviceSec: SectionsService, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      if (params['id_ques']) {
        this.idQues = params['id_ques'];
        this.getQuestion();
      } else if (params['id_sec']) {
        this.idSec = params['id_sec'];
        this.getSection();
      }
    });

    this.getDependencies(this.idQues, this.idSec);
  }

  getQuestion() {
    this.serviceQues.quesById(this.idQues).subscribe(question => {
      this.dataQues = question[0];
      this.nameChild = this.dataQues['name_ques']

        this.breadcrumb.push(
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/sections', name: 'Secciones' },
          { url: `../../../../home/questions/id_sec/${this.dataQues['id_sec']}`, name: `Preguntas ${this.dataQues['name_sec']}` },
          { url: '', name: `Dependencias ${this.nameChild}` },
        );
    });
  }

  getSection() {
    this.serviceSec.secById(this.idSec).subscribe(section => {
      this.dataSec = section;
      this.nameChild = this.dataSec['nameSection'];

      if (true) {
        this.breadcrumb.push(
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/sections', name: 'Secciones' },
          { url: '', name: `Dependencias ${this.nameChild}` }
        );
      } else {
        this.breadcrumb.push(
          { url: '../../../../home/formats', name: 'Inicio' },
          { url: '../../../../home/sections', name: 'Secciones' },
          { url: '', name: `Dependencias ${this.nameChild}` }
        );
      }
    });
  }

  getDependencies(idQues, idSec) {
    if (idQues) {
      this.service.listByIdQues(idQues).subscribe(dependencies => {
        this.data = dependencies;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
      });
    } else if (idSec) {
      this.service.listByIdSec(idSec).subscribe(dependencies => {
        this.data = dependencies;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  refresh() {
    this.getDependencies(this.idQues, this.idSec);
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddDependencyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idQues: this.idQues, idSec: this.idSec }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getDependencies(this.idQues, this.idSec);
    });
  }

  startEdit(i: number, id_dep: number, id_ques: number, name_ques: string, id_sec_dep: number, id_ques2: number, operator_dep: string,
    value_dep: string, or_dep: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    this.editDialogRef = this.dialog.open(EditDependencyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { id_dep, id_ques, name_ques, id_sec_dep, id_ques2, operator_dep, value_dep, or_dep }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getDependencies(this.idQues, this.idSec);
    });
  }

  startDelete(i: number, id_dep: number, id_ques: number, name_ques: string, id_sec_dep: number, id_ques2: number) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelDependencyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { id_dep, id_ques, name_ques, id_sec_dep, id_ques2 }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getDependencies(this.idQues, this.idSec);
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
