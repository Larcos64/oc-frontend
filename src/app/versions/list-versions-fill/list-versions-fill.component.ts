import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PermitsService } from '../../core/services/permits.service';
import { VersionsService } from '../services/versions.service';
import { ActVersion } from 'src/app/shared/models/actversion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CompformatService } from '../../compformat/services/compformat.service';
import { CompaniesService } from '../../companies/services/companies.service';
import { FormatsService } from '../../formats/services/formats.service';

@Component({
  selector: 'app-list-versions-fill',
  templateUrl: './list-versions-fill.component.html',
  styleUrls: ['./list-versions-fill.component.scss']
})
export class ListVersionsFillComponent implements OnInit {

  data = new Array();
  dataCf = new Array();
  dataComp = new Array();
  dataForm = new Array();
  breadcrumb = new Array();
  idForm: number;
  idComp: number;
  nameComp: string;
  nameForm: string;

  columnsFormat: string[] = ['codVersion', 'version', 'dateCreated', 'stateVersion', 'actions'];
  dataSource: MatTableDataSource<ActVersion>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  permAdmin = this.servicePermits.validatePermit('Administrar');

  idCf: number;
  permFillout = this.servicePermits.validatePermit('Empresas.formatos.versiones.diligenciar');

  constructor(private service: VersionsService, public dialog: MatDialog, public servicePermits: PermitsService,
    private activateRoute: ActivatedRoute, private snackbar: MatSnackBar, private serviceCf: CompformatService,
    private serviceComp: CompaniesService, private serviceForm: FormatsService, private router: Router) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idCf = params["id_sat"];
    });
    this.getCf();
  }

  getCf() {
    this.serviceCf.cfById(this.idCf).subscribe(cf => {
      this.dataCf = cf;
      this.idComp = this.dataCf['idComp'];
      this.idForm = this.dataCf['idFormat'];
      this.getComp();
      this.getFormat();
      this.listVersions();
      this.breadcrumb = [
        { url: '/home/homePage', name: 'Inicio' },
        { url: '../../../../home/companies', name: 'Empresas' }
      ];
    });
  }

  getComp() {
    this.serviceComp.compById(this.idComp).subscribe(company => {
      this.dataComp = company;
      this.nameComp = this.dataComp[0]['nameComp'];
      this.breadcrumb.push({ url: `../../../../home/compformat/id_comp/${this.idComp}`, name: `Formatos ${this.nameComp}` });
    });
  }

  getFormat() {
    this.serviceForm.formById(this.idForm).subscribe(format => {
      this.dataForm = format;
      this.nameForm = this.dataForm['nameFormat'];
      this.breadcrumb.push({ url: '', name: `Versiones ${this.nameForm}` });
    });
  }

  listVersions() {
    this.service.list(this.idForm).subscribe(list => {
      this.data = list;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.listVersions();
  }

  fillFormat(idVer: number) {
    this.router.navigate(['home/fillformat/', this.idCf, idVer]);
  }

  reportsFormat(idVer: number) {
    this.router.navigate(['home/regformats/', this.idCf, this.idForm, idVer, this.idComp]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
