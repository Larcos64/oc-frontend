import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcsPermission } from '../../shared/models/acspermission.model';
import { PermissionsService } from '../services/permissions.service';
import { AddPermissionDialogComponent } from '../add-permission-dialog/add-permission-dialog.component';
import { EditPermissionDialogComponent } from '../edit-permission-dialog/edit-permission-dialog.component';
import { DelPermissionDialogComponent } from '../del-permission-dialog/del-permission-dialog.component';
import { PermitsService } from '../../core/services/permits.service';

@Component({
  selector: 'app-list-permissions',
  templateUrl: './list-permissions.component.html',
  styleUrls: ['./list-permissions.component.scss']
})
export class ListPermissionsComponent implements OnInit {

  data = new Array();
  breadcrumb = new Array();
  columnsPermission: string[] = ['id', 'permission', 'description', 'actions'];
  dataSource: MatTableDataSource<AcsPermission>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddPermissionDialogComponent>;
  editDialogRef: MatDialogRef<EditPermissionDialogComponent>;
  delDialogRef: MatDialogRef<DelPermissionDialogComponent>;
  index: number;

  permCreate = this.servicePermits.validatePermit('Permisos.crear');
  permEdit = this.servicePermits.validatePermit('Permisos.editar');
  permDel = this.servicePermits.validatePermit('Permisos.eliminar');

  constructor(private service: PermissionsService, public dialog: MatDialog, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.getPermissions();
    this.breadcrumb = [
      { url: '/home/homePage', name: 'Inicio' },
      { url: '', name: 'Permisos' },
    ];
  }

  getPermissions() {
    this.service.list().subscribe(profiles => {
      this.data = profiles;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getPermissions();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddPermissionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getPermissions();
    });
  }

  startEdit(i: number, idPermis: number, namePermis: string, desPermis: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditPermissionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idPermis, namePermis, desPermis }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getPermissions();
    });
  }

  startDelete(i: number, idPermis: number, namePermis: string, desPermis: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelPermissionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idPermis, namePermis, desPermis }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getPermissions();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
