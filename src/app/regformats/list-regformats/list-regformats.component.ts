import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ArRegFormat } from "../../shared/models/arregformat.model";
import { PermitsService } from "../../core/services/permits.service";
import { VersionsService } from "../../versions/services/versions.service";
import { ActVersion } from "src/app/shared/models/actversion.model";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { snackOk, snackError } from "src/app/util/snackbar-util";
import { MatSnackBar } from "@angular/material";
import { CompaniesService } from "../../companies/services/companies.service";
import { FormatsService } from "../../formats/services/formats.service";
import { RegformatsService } from "../services/regformats.service";
import { CompformatService } from "../../compformat/services/compformat.service";
import { UsersService } from "../../users/services/users.service";
import { WorkplacesService } from "../../workarea/services/workplaces.service";
import { NumberSymbol } from "@angular/common";
import { VersionSectionService } from "../../versions/services/versionssection.service";
import { VersionsQuesService } from "../../versions/services/versionsques.service";
import { OptvaluesService } from "../../optvalues/services/optvalues.service";

@Component({
  selector: "app-list-regformats",
  templateUrl: "./list-regformats.component.html",
  styleUrls: ["./list-regformats.component.scss"],
})
export class ListRegformatsComponent implements OnInit {
  form: FormGroup;
  breadcrumb = new Array();
  data = new Array();
  companies = new Array();
  compformats = new Array();
  versions = new Array();
  users = new Array();
  wplaces = new Array();
  dataReportGeneral = new Array();
  dataVersion = new Array();

  idComp: number;
  id_comp: number;
  id_format: number;
  id_version: number;
  id_user: number;
  id_wplace: number;
  for_date: string;
  init_date: string;
  end_date: string;
  logoComp:string;

  dataSearch = {};

  breakpoint: number;
  colspan: number;

  isLastStepCondition: boolean;
  flagidFor: number;
  listIds: Object;
  dataReport = new Array();
  infoReport = new Array();
  datos = new Array();

  biosecurity = false;
  /*
  dataCf = new Array();
  dataComp = new Array();
  dataForm = new Array();
  dataVer = new Array();
  idCf: number;
  idForm: number;
  idVer: number;
  idComp: number;
  nameComp: string;
  nameForm: string;
  codVer: number;
  ver: number;
  */

  columnsRf: string[] = [
    "company",
    "workplace",
    "user",
    "init_date_rf",
    "fin_date_rf",
    "actions",
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  actDate = new Date();

  query = {
    init_date_rf: "01/01/2020",
    end_date_rf: this.actDate,
  };

  permSuperAdmin = this.servicePermits.validatePermit("super.admin");

  constructor(
    private service: RegformatsService,
    public dialog: MatDialog,
    public servicePermits: PermitsService,
    private activateRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private serviceComp: CompaniesService,
    private serviceForm: FormatsService,
    private router: Router,
    private serviceCf: CompformatService,
    private serviceVer: VersionsService,
    private serviceUsers: UsersService,
    private serviceWplace: WorkplacesService,
    private fb: FormBuilder,
    private serviceVerSec: VersionSectionService,
    private serviceVerQues: VersionsQuesService,
    private serviceOptVal: OptvaluesService
  ) {

    this.activateRoute.params.subscribe(params => {
      if (params['id_comp']) {
        this.idComp = params["id_comp"];
        this.biosecurity = true;
      }
    });
  }

  ngOnInit() {
    /* this.activateRoute.params.subscribe(params => {
      this.idCf = params["id_cf"];
      this.idForm = params["id_format"];
      this.idVer = params["id_ver"];
    });
    this.getCf(); */
    this.isLastStepCondition = false;

    if (!this.biosecurity) {
      this.getCompanies();
      this.breadcrumb.push(
        { url: "/home/homePage", name: "Inicio" },
        { url: "", name: "Reportes" }
      );

    } else {
      this.getCompany();
      this.breadcrumb.push(
        { url: "/home/homePage", name: "Inicio" },
        { url: '/home/biosecurity', name: `Bioseguridad` },
        { url: '', name: `Reportes` }
      );

    }

    this.initForm();

    this.setDataAdmin();

    this.breakpoint = window.innerWidth <= 400 ? 1 : 2;
    this.colspan = window.innerWidth <= 400 ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 800 ? 1 : 2;
    this.colspan = event.target.innerWidth <= 800 ? 1 : 2;
  }

  initForm() {
    this.form = this.fb.group({
      id_comp: ["", Validators.required],
      /* init_date_rf: ['', Validators.required],
      end_date_rf: ['', Validators.required], */
      init_date: ["", Validators.required],
      end_date: ["", Validators.required],
      id_format: [{ value: "", disabled: true }],
      id_version: [{ value: "", disabled: true }],
      id_user: [{ value: "", disabled: true }],
      id_wplace: [{ value: "", disabled: true }],
      for_date: ["init"],
    });
  }

  setDataAdmin() {
    this.idComp = JSON.parse(localStorage.getItem("idComp"));

    if (!this.permSuperAdmin) {
      //console.log("Admin");
      // this.form.controls.id_comp.setValue(this.idComp);
      this.form.get("id_comp").disable();
      this.form.get("id_comp").setValue(this.idComp);
      this.onCompChange(this.idComp, true);
    }
  }

  onCompChange(idcomp, admin) {
    if (admin) {
      var idComp = idcomp;
    } else {
      var idComp = idcomp.value;
    }

    if (!this.biosecurity) {
      this.getCf(idComp);
    } else {
      this.getCfBio(this.idComp);
    }

    this.getUsers(idComp);
    this.getWplaces(idComp);
  }

  onFormChange(idform) {
    this.flagidFor = idform.value;
    if (this.flagidFor == 1) {
      this.isLastStepCondition = false;
    }
    this.getVer(idform.value);
  }

  getCompanies() {
    this.serviceComp.list().subscribe((comp) => {
      this.companies = comp;
    });
  }
  getCompany() {
    this.serviceComp.compById(this.idComp).subscribe(comp => this.companies = comp);
  }

  getCf(idcomp) {
    this.serviceCf.listByIdComp(idcomp).subscribe((cf) => {
      this.compformats = cf;

      if (this.compformats.length > 0) {
        this.form.get("id_format").setValidators([Validators.required]);
        this.form.get("id_format").enable();
        this.form.get("id_format").updateValueAndValidity();
      } else {
        this.form.get("id_format").clearValidators();
        this.form.get("id_format").disable();
        this.form.get("id_format").updateValueAndValidity();
      }
    });
  }

  getCfBio(idcomp) {
    this.serviceCf.listByIdCompBio(idcomp).subscribe((cf) => {
      this.compformats = cf;

      if (this.compformats.length > 0) {
        this.form.get("id_format").setValidators([Validators.required]);
        this.form.get("id_format").enable();
        this.form.get("id_format").updateValueAndValidity();
      } else {
        this.form.get("id_format").clearValidators();
        this.form.get("id_format").disable();
        this.form.get("id_format").updateValueAndValidity();
      }
    });
  }

  getVer(idform) {
    this.serviceVer.list(idform).subscribe((ver) => {
      this.versions = ver;

      if (this.versions.length > 0) {
        this.form.get("id_version").setValidators([Validators.required]);
        this.form.get("id_version").enable();
        this.form.get("id_version").updateValueAndValidity();
      } else {
        this.form.get("id_version").clearValidators();
        this.form.get("id_version").disable();
        this.form.get("id_version").updateValueAndValidity();
      }
    });
  }

  getUsers(idcomp) {
    this.serviceUsers.listByIdComp(idcomp).subscribe((users) => {
      this.users = users;

      if (this.users.length > 0) {
        // this.form.get('id_user').setValidators([Validators.required]);
        this.form.get("id_user").enable();
        // this.form.get('id_user').updateValueAndValidity();
      } else {
        // this.form.get('id_user').clearValidators();
        this.form.get("id_user").disable();
        // this.form.get('id_user').updateValueAndValidity();
      }
    });
  }

  getWplaces(idcomp) {
    this.serviceWplace.listByIdComp(idcomp).subscribe((wplaces) => {
      this.wplaces = wplaces;

      if (this.wplaces.length > 0) {
        // this.form.get('id_wplace').setValidators([Validators.required]);
        this.form.get("id_wplace").enable();
        // this.form.get('id_wplace').updateValueAndValidity();
      } else {
        // this.form.get('id_wplace').clearValidators();
        this.form.get("id_wplace").disable();
        // this.form.get('id_wplace').updateValueAndValidity();
      }
    });
  }

  searchRf() {
    this.dataReportGeneral = []
    this.dataVersion = []
    if (this.flagidFor != 1) {
      this.isLastStepCondition = true;
    } else {
      this.isLastStepCondition = false;
    }

    this.id_comp = this.form.get("id_comp").value;
    this.id_format = this.form.get("id_format").value;
    this.id_version = this.form.get("id_version").value;
    this.id_user = this.form.get("id_user").value;
    this.id_wplace = this.form.get("id_wplace").value;
    this.for_date = this.form.get("for_date").value;
    this.init_date = this.form.get("init_date").value;
    this.end_date = this.form.get("end_date").value;

    var end_date = new Date(this.end_date);
    end_date.setHours(end_date.getHours() + 24);

    this.dataSearch = {
      id_comp: this.id_comp,
      id_format: this.id_format,
      id_version: this.id_version,
      id_user: this.id_user,
      id_wplace: this.id_wplace,
      for_date: this.for_date,
      init_date: this.init_date,
      end_date: end_date,
    };

    // console.log("DS: ", this.dataSearch);

    let filters = JSON.stringify(this.dataSearch);
    // console.log(filters)
    this.service.listByFilters(filters).subscribe((result) => {
      this.data = result;
      // console.log("dataS: ", this.data);
      this.data.forEach(element => {
        this.service.getDataToReports(element.id_rf).subscribe((result) => {
          //console.log(result);
          this.dataReportGeneral.push(result)
        });
        this.serviceVer.getById(element.id_version).subscribe(version => {
          this.dataVersion.push(version);
          });
      });
      //console.log(this.dataReportGeneral);
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      //console.log(this.data);
    });
  }

  reportDetail(idRf: number, idForm: number, idVer: number, idComp: number) {
    let route = "home/regformats/";

    if (this.biosecurity) {
      route = "/home/biosecurity/"
      this.router.navigate([
        route,
        idRf,
        idForm,
        idVer,
        idComp,
        'biosec'
      ]);

    } else {
      this.router.navigate([
        route,
        idRf,
        idForm,
        idVer,
        idComp,
      ]);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

   generateReportGeneralInExcel() {
    if (this.dataReportGeneral.length > 0) {
      this.serviceComp.compById(this.idComp).subscribe(infoComp => {
        this.logoComp = infoComp[0].logoComp;
        this.service.generateAllQuestions(this.dataReportGeneral, this.data, this.dataVersion[0],this.logoComp)
      })      
    }
  }
}
