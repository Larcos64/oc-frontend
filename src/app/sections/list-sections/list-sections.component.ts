import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActSection } from '../../shared/models/actsection.model';
import { PermitsService } from '../../core/services/permits.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SectionsService } from '../services/sections.service';
import { AddSectionDialogComponent } from '../add-section-dialog/add-section-dialog.component';
import { EditSectionDialogComponent } from '../edit-section-dialog/edit-section-dialog.component';
import { DelSectionDialogComponent } from '../del-section-dialog/del-section-dialog.component';

@Component({
  selector: 'app-list-sections',
  templateUrl: './list-sections.component.html',
  styleUrls: ['./list-sections.component.scss']
})
export class ListSectionsComponent implements OnInit {

  data = new Array();
  breadcrumb = new Array();
  columnsFormat: string[] = ['name', 'type', 'actions'];
  dataSource: MatTableDataSource<ActSection>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddSectionDialogComponent>;
  editDialogRef: MatDialogRef<EditSectionDialogComponent>;
  delDialogRef: MatDialogRef<DelSectionDialogComponent>;
  index: number;

  permQuestions = this.servicePermits.validatePermit('Secciones.preguntas');
  permDependencies = this.servicePermits.validatePermit('Secciones.dependencias');
  permCreate = this.servicePermits.validatePermit('Secciones.crear');
  permEdit = this.servicePermits.validatePermit('Secciones.editar');
  permDel = this.servicePermits.validatePermit('Secciones.eliminar');

  constructor(private service: SectionsService, public dialog: MatDialog, private router: Router,
    public servicePermits: PermitsService) { }

  ngOnInit() {
    this.getSections();
      this.breadcrumb.push(
        { url: '/home/homePage', name: 'Inicio' },
        { url: '', name: 'Secciones' },
      );
  }

  getSections() {
    this.service.list().subscribe(sections => {
      this.data = sections;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getSections();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddSectionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getSections();
    });
  }

  startEdit(i: number, idSection: number, nameSection: string, descSection: string, typeSection: string, tableName: string, cycle:string) {
    this.index = i;
    this.editDialogRef = this.dialog.open(EditSectionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        idSection, nameSection, descSection, typeSection, tableName, cycle
      }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getSections();
    });
  }

  addQuestion(idSection: number) {
    this.router.navigate(["home/questions/id_sec", idSection]);
  }

  startDelete(i: number, idSection: number, nameSection: string, descSection: string, typeSection: string, cycle:string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelSectionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idSection, nameSection, descSection, typeSection, cycle }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getSections();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  viewQuestions(idSec: number) {
    this.router.navigate(["home/questions/id_sec", idSec]);
  }

  viewDependencies(idSec: number) {
    this.router.navigate(["home/dependencies/id_sec", idSec]);
  }

}
