import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcsCompany } from '../../shared/models/acscompany.model';
import { PermitsService } from '../../core/services/permits.service';
import { CompaniesService } from '../services/companies.service';
import { AddCompanyDialogComponent } from '../add-company-dialog/add-company-dialog.component';
import { EditCompanyDialogComponent } from '../edit-company-dialog/edit-company-dialog.component';
import { DelCompanyDialogComponent } from '../del-company-dialog/del-company-dialog.component';

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.scss'],
})
export class ListCompaniesComponent implements OnInit {
  data = new Array();
  breadcrumb = new Array();
  columnsCompany: string[] = ['nit', 'name', 'phone_c', 'admin', 'actions'];
  dataSource: MatTableDataSource<AcsCompany>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddCompanyDialogComponent>;
  editDialogRef: MatDialogRef<EditCompanyDialogComponent>;
  delDialogRef: MatDialogRef<DelCompanyDialogComponent>;
  index: number;
  permUsers = this.servicePermits.validatePermit('Empresas.usuarios');
  permWorkPlace = this.servicePermits.validatePermit('Empresas.sitiosTrabajo');
  permFormats = this.servicePermits.validatePermit('Empresas.formatos');
  permCreate = this.servicePermits.validatePermit('Empresas.crear');
  permEdit = this.servicePermits.validatePermit('Empresas.editar');
  permDel = this.servicePermits.validatePermit('Empresas.eliminar');

  constructor(private service: CompaniesService, public dialog: MatDialog, private router: Router, public servicePermits: PermitsService) { }

  ngOnInit() {
    if (this.servicePermits.validatePermit('super.admin')) {
      this.getCompanies();
    } else {
      this.getCompaniesID();
    }
    this.breadcrumb = [
      { url: '/home/homePage', name: 'Inicio' },
      { url: '', name: 'Empresas' },
    ];
  }

  getCompanies() {
    this.service.list().subscribe((companies) => {
      this.data = companies;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  getCompaniesID() {
    let userLoged = new Array(), user = new Array();
    userLoged = JSON.parse(localStorage.getItem('userLoged'))
    user = userLoged['user']
    const idComp = user['idComp']
    this.service.compById(idComp).subscribe((company) => {
      this.data = company;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    if (this.servicePermits.validatePermit('super.admin')) {
      this.getCompanies();
    } else {
      this.getCompaniesID();
    }
  }

  viewUsers(idComp: number) {
    this.router.navigate(['home/users/id_comp', idComp]);
  }

  viewWorkplaces(idComp: number) {
    this.router.navigate(['home/workarea/id_comp', idComp]);
  }

  viewFormats(idComp: number) {
    this.router.navigate(['home/compformat/id_comp', idComp]);
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
    });

    this.addDialogRef.afterClosed().subscribe((result) => {
      if (this.servicePermits.validatePermit('super.admin')) {
        this.getCompanies();
      } else {
        this.getCompaniesID();
      }
    });
  }

  startEdit(
    i: number,
    flagAdmin: string,
    idComp: number,
    nameComp: string,
    nitComp: string,
    nameLegalRep: string,
    identLegalRep: string,
    emailComp: string,
    addressComp: string,
    phoneComp: string,
    numEmployee: number,
    logoComp: string
  ) {
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    // console.log(this.index);
    this.editDialogRef = this.dialog.open(EditCompanyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        flagAdmin,
        idComp,
        nameComp,
        nitComp,
        nameLegalRep,
        identLegalRep,
        emailComp,
        addressComp,
        phoneComp,
        numEmployee,
        logoComp
      },
    });

    this.editDialogRef.afterClosed().subscribe((result) => {
      if (this.servicePermits.validatePermit('super.admin')) {
        this.getCompanies();
      } else {
        this.getCompaniesID();
      }
    });
  }

  startDelete(
    i: number,
    idComp: number,
    nameComp: string,
    nitComp: string
  ) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelCompanyDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { idComp, nameComp, nitComp },
    });

    this.delDialogRef.afterClosed().subscribe((result) => {
      if (this.servicePermits.validatePermit('super.admin')) {
        this.getCompanies();
      } else {
        this.getCompaniesID();
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // validatePermit(permit: string) {
  //   let permitsAssignment = new Array();
  //   permitsAssignment = JSON.parse(localStorage.getItem('permissions'));
  //   console.log("PA: ", permitsAssignment);
  //   const permitFound = permitsAssignment.find((obj) => obj.name_permis === permit);
  //   if (permitFound) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
