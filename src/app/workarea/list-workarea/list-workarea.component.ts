import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcsWorkplace } from '../../shared/models/acsworkpace.model';
import { WorkplacesService } from '../services/workplaces.service';
import { AddWorkplaceDialogComponent } from '../add-workarea-dialog/add-workarea-dialog.component';
import { EditWorkplaceDialogComponent } from '../edit-workarea-dialog/edit-workarea-dialog.component';
import { DelWorkplaceDialogComponent } from '../del-workarea-dialog/del-workarea-dialog.component';
import { PermitsService } from '../../core/services/permits.service';
import { CompaniesService } from 'src/app/companies/services/companies.service';

@Component({
  selector: 'app-list-workarea',
  templateUrl: './list-workarea.component.html',
  styleUrls: ['./list-workarea.component.scss']
})
export class ListWorkplacesComponent implements OnInit {

  data = new Array();
  dataComp = new Array();
  breadcrumb = new Array();
  nameComp: string;
  columnsWorkplace: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: MatTableDataSource<AcsWorkplace>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddWorkplaceDialogComponent>;
  editDialogRef: MatDialogRef<EditWorkplaceDialogComponent>;
  delDialogRef: MatDialogRef<DelWorkplaceDialogComponent>;
  index: number;
  idComp: number;

  permCreate = this.servicePermits.validatePermit('Empresas.usuarios.crear');
  permEdit = this.servicePermits.validatePermit('Empresas.usuarios.editar');
  permDel = this.servicePermits.validatePermit('Empresas.usuarios.eliminar');

  constructor(private service: WorkplacesService, private serviceComp: CompaniesService, public dialog: MatDialog,
    private activateRoute: ActivatedRoute, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idComp = params["id_comp"];
    });
    this.getCompany();
    this.getWorkplaces();
  }

  getCompany() {
    this.serviceComp.compById(this.idComp).subscribe(company => {
      this.dataComp = company;
      this.nameComp = this.dataComp[0]["nameComp"];
      this.breadcrumb = [
        { url: '/home/homePage', name: 'Inicio' },
        { url: '../../../../home/companies', name: 'Empresas' },
        { url: '', name: `Sitios de trabajo ${this.nameComp}` },
      ];
    });
  }

  
  getWorkplaces() {
    this.service.listByIdComp(this.idComp).subscribe(workplaces => {
      this.data = workplaces;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getWorkplaces();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddWorkplaceDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idComp: this.idComp }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getWorkplaces();
    });
  }

  startEdit(i: number, idWorkplace: number, idComp: number, nameWorkplace: string, addressWorkplace: string, phoneWorkplace: string,
    fixed: boolean, riskLvlWorkplace: number) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditWorkplaceDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idWorkplace, idComp, nameWorkplace, addressWorkplace, phoneWorkplace, fixed, riskLvlWorkplace }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getWorkplaces();
    });
  }

  startDelete(i: number, idWorkplace: number, idComp: number, nameWorkplace: string, addressWorkplace: string, fixed: boolean) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelWorkplaceDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idWorkplace, idComp, nameWorkplace, addressWorkplace, fixed }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getWorkplaces();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
