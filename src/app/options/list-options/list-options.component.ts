import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActOption } from '../../shared/models/actoption.model';
import { PermitsService } from '../../core/services/permits.service';
import { OptionsService } from '../services/options.service';
import { AddOptionDialogComponent } from '../add-option-dialog/add-option-dialog.component';
import { EditOptionDialogComponent } from '../edit-option-dialog/edit-option-dialog.component';
import { DelOptionDialogComponent } from '../del-option-dialog/del-option-dialog.component';

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.scss']
})
export class ListOptionsComponent implements OnInit {

  data = new Array();
  breadcrumb = new Array();
  columnsOption: string[] = ['name', 'desc', 'code', 'actions'];
  dataSource: MatTableDataSource<ActOption>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddOptionDialogComponent>;
  editDialogRef: MatDialogRef<EditOptionDialogComponent>;
  delDialogRef: MatDialogRef<DelOptionDialogComponent>;
  index: number;

  permCreate = this.servicePermits.validatePermit('Opciones.crear');
  permEdit = this.servicePermits.validatePermit('Opciones.editar');
  permDel = this.servicePermits.validatePermit('Opciones.eliminar');

  constructor(private service: OptionsService, public dialog: MatDialog, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.getOptions();

    
      this.breadcrumb.push(
        { url: '../../../home', name: 'Inicio' },
        { url: '', name: 'Opciones' },
      );
  }

  getOptions() {
    this.service.list().subscribe(options => {
      this.data = options;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getOptions();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddOptionDialogComponent, {
      width: '950px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getOptions();
    });
  }

  startEdit(i: number, idOption: number, nameOption: string, descOption: string, codOption: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditOptionDialogComponent, {
      width: '950px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idOption, nameOption, descOption, codOption }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getOptions();
    });
  }

  startDelete(i: number, idOption: number, nameOption: string, descOption: string, codOption: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelOptionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idOption, nameOption, descOption, codOption }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getOptions();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
