import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AcsUser } from '../../shared/models/acsuser.model';
// import { AcsCompany } from '../../shared/models/acscompany.model';
import { UsersService } from '../services/users.service';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { DelUserDialogComponent } from '../del-user-dialog/del-user-dialog.component';
import { PermitsService } from '../../core/services/permits.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  data = new Array();
  dataComp = new Array();
  breadcrumb = new Array();
  nameComp: string;
  columnsUser: string[] = ['ident', 'name', 'lastname', 'email', 'actions'];
  dataSource: MatTableDataSource<AcsUser>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  addDialogRef: MatDialogRef<AddUserDialogComponent>;
  editDialogRef: MatDialogRef<EditUserDialogComponent>;
  delDialogRef: MatDialogRef<DelUserDialogComponent>;
  index: number;
  idComp: number;

  permCreate = this.servicePermits.validatePermit('Empresas.usuarios.crear');
  permEdit = this.servicePermits.validatePermit('Empresas.usuarios.editar');
  permDel = this.servicePermits.validatePermit('Empresas.usuarios.eliminar');

  constructor(private service: UsersService, public dialog: MatDialog,
    private activateRoute: ActivatedRoute, public servicePermits: PermitsService) {
    // this.service.list()
    //   .pipe().subscribe(data => {
    //     console.log("ACA", data);
    //   },
    //     // err => {
    //     //   snackError(this.snackbar, err);
    //     // }
    //   );
  }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idComp = params["id_comp"];
    });
    
    this.getUsers();
  }

  
  getUsers() {
    this.service.listByIdComp(this.idComp).subscribe(user => {
      this.data = user;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  refresh() {
    this.getUsers();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idComp: this.idComp }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.getUsers();
      //this.animal = result;
    });
  }

  startEdit(i: number, idUser: number, idProf: number, idComp: number, identUser: string, nameUser: string, lastnameUser: string,
    emailUser: string, passUser: string, rhUser: string, genderUser: string, dateBirthUser, entailmentDateUser) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        idUser, idProf, idComp, identUser, nameUser, lastnameUser, emailUser, passUser, rhUser, genderUser, dateBirthUser, entailmentDateUser
      }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });

    /*
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
    */
  }

  startDelete(i: number, idUser: number, idComp: number, identUser: string, nameUser: string, lastnameUser: string, emailUser: string) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelUserDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idUser, idComp, identUser, nameUser, lastnameUser, emailUser }
    });

    this.delDialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

  // filter(event: Event) {
  //   const filtro = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filtro.trim().toLowerCase();
  // }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
