import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActsCompFormat } from '../../shared/models/actscompformat.model';
import { PermitsService } from '../../core/services/permits.service';
import { CompaniesService } from '../../companies/services/companies.service';
import { CompformatService } from '../services/compformat.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-list-compformat',
  templateUrl: './list-compformat.component.html',
  styleUrls: ['./list-compformat.component.scss']
})
export class ListCompformatComponent implements OnInit {
  data = new Array();
  breadcrumb = new Array();
  dataComp = new Array();
  nameComp: string;
  columnsCompFormat: string[] = ['cod', 'name', 'type', 'issue', 'actions'];
  dataSource: MatTableDataSource<ActsCompFormat>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  idComp: number;

  permFill = this.servicePermits.validatePermit('Empresas.formatos.versiones');

  Biosecurity = false;

  constructor(private activateRoute: ActivatedRoute, private service: CompformatService, private serviceComp: CompaniesService,
    private router: Router, public servicePermits: PermitsService, private sessionService: SessionService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      if (params['id_comp']) {
        this.idComp = params['id_comp'];
        this.getCompFormats(this.idComp);

      } else {
        this.Biosecurity = true;
        this.idComp = Number(this.sessionService.idComp);
        this.getCompFormatsBio(this.idComp);
      }

      this.getCompany();
    });


  }

  getCompFormats(idComp) {
    if (idComp) {
      this.service.listByIdComp(idComp).subscribe(compformats => {
        this.data = compformats;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  getCompFormatsBio(idComp) {
    if (idComp) {
      this.service.listByIdCompBio(idComp).subscribe(compformats => {
        this.data = compformats;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  refresh() {
    this.getCompFormats(this.idComp);
  }

  getCompany() {
    this.serviceComp.compById(this.idComp).subscribe(company => {
      this.dataComp = company;
      this.nameComp = this.dataComp[0]['nameComp'];

      if (this.Biosecurity) {

        this.breadcrumb = [
          { url: '/home/homePage', name: 'Inicio' },
          { url: '/home/biosecurity', name: `Bioseguridad` },
          { url: '', name: `Formatos ${this.nameComp}` }
        ]

      } else {
        this.breadcrumb = [
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/companies', name: 'Empresas' },
          { url: '', name: `Formatos ${this.nameComp}` },
        ];
      }
    });
  }

  /* fillFormat(idCf: number) {
      this.router.navigate(['home/fillformat/id_sat', idCf]);
  } */

  listVersions(idCf: number) {
    this.router.navigate(['home/versions/id_sat', idCf]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
