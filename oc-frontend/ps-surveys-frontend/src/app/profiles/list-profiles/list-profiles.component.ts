import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcsProfile } from '../../shared/models/acsprofile.model';
import { ProfilesService } from '../services/profiles.service';
import { AddProfileDialogComponent } from '../add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { DelProfileDialogComponent } from '../del-profile-dialog/del-profile-dialog.component';
import { EditPermissionsDialogComponent } from '../edit-permissions-dialog/edit-permissions-dialog.component';
import { PermitsService } from '../../core/services/permits.service';

@Component({
  selector: 'app-list-profiles',
  templateUrl: './list-profiles.component.html',
  styleUrls: ['./list-profiles.component.scss']
})
export class ListProfilesComponent implements OnInit {

  data = new Array();
  breadcrumb = new Array();
  columnsProfile: string[] = ['id', 'name', 'actions'];
  dataSource: MatTableDataSource<AcsProfile>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddProfileDialogComponent>;
  editDialogRef: MatDialogRef<EditProfileDialogComponent>;
  delDialogRef: MatDialogRef<DelProfileDialogComponent>;
  editPermisDialogRef: MatDialogRef<EditPermissionsDialogComponent>;
  index: number;

  permEditPerms = this.servicePermits.validatePermit('Perfiles.editarPermisos');
  permCreate = this.servicePermits.validatePermit('Permisos.crear');
  permEdit = this.servicePermits.validatePermit('Permisos.editar');
  permDel = this.servicePermits.validatePermit('Permisos.eliminar');

  constructor(private service: ProfilesService, public dialog: MatDialog, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.getProfiles();
    this.breadcrumb = [
      { url: '/home/homePage', name: 'Inicio' },
      { url: '', name: 'Perfiles' }
    ];
  }

  getProfiles() {
    this.service.list().subscribe(profiles => {
      this.data = profiles;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getProfiles();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddProfileDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getProfiles();
    });
  }

  startEdit(i: number, idProf: number, nameProf: string) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idProf, nameProf }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getProfiles();
    });
  }

  startDelete(i: number, idProf: number, nameProf: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelProfileDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idProf, nameProf }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getProfiles();
    });
  }

  startEditPermis(i: number, idProf: number, nameProf: string) {
    this.index = i;
    this.editPermisDialogRef = this.dialog.open(EditPermissionsDialogComponent, {
      width: '500px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idProf, nameProf }
    });

    this.editPermisDialogRef.afterClosed().subscribe(result => {
      this.getProfiles();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
