import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArRegFormat } from '../../shared/models/arregformat.model';
import { PermitsService } from '../../core/services/permits.service';
import { VersionsService } from '../../versions/services/versions.service';
// import { ActVersion } from 'src/app/shared/models/actversion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
// import { snackOk, snackError } from 'src/app/util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { CompaniesService } from '../../companies/services/companies.service';
import { FormatsService } from '../../formats/services/formats.service';
import { RegformatsService } from '../services/regformats.service';
import { CompformatService } from '../../compformat/services/compformat.service';
import { UsersService } from '../../users/services/users.service';
import { VersionSectionService } from '../../../app/versions/services/versionssection.service';
import { VersionsQuesService } from '../../../app/versions/services/versionsques.service';
import { WorkplacesService } from '../../workarea/services/workplaces.service';
import { OptvaluesService } from '../../optvalues/services/optvalues.service';
import { MatAccordion } from '@angular/material/expansion';
import { CollaboratorserviceService } from 'src/app/collaborators/services/collaboratorservice.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {

  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  // @ViewChild('accordion', { static: true }) accordion: MatAccordion;
  xpandStatus = true;

  idRf: number;
  idForm: number;
  idVer: number;
  nameForm: string;
  idComp: number;
  nameComp: string;
  infoComp: Object;
  logoComp: string;
  tableName: string;
  codVersion: string;
  numVersion: number;
  dateVersion: string;
  error: string;
  loading = false;
  breadcrumb = new Array();
  dataForm = new Array();
  dataVersion = new Array();
  sections = new Array();
  dataSearch = new Array();
  dataReport = new Array();
  infoReport = new Array();
  workPlaces = new Array();

  biosecurity = false;

  percentagePart: number;
  percentageProgress: number;
  percentage: string;

  constructor(private service: RegformatsService, public dialog: MatDialog, public servicePermits: PermitsService,
    private activateRoute: ActivatedRoute, private snackbar: MatSnackBar, private serviceComp: CompaniesService,
    private serviceForm: FormatsService, private router: Router, private serviceCf: CompformatService,
    private serviceVer: VersionsService, private serviceUsers: UsersService, private serviceWplace: WorkplacesService,
    private serviceVerSec: VersionSectionService, private serviceVerQues: VersionsQuesService,
    private serviceOptVal: OptvaluesService, private collService: CollaboratorserviceService) {

    this.activateRoute.params.subscribe(params => {
      this.idRf = params["id_rf"];
      this.idForm = params["id_form"];
      this.idVer = params["id_ver"];
      this.idComp = params['id_comp'];
      if (params['bio']) {
        this.biosecurity = true;
      }
      /* console.log("idRf: ", this.idRf);
      console.log("idForm: ", this.idForm);
      console.log("idVer: ", this.idVer); */
    });

    this.serviceComp.compById(this.idComp).subscribe(infoComp => {
      this.infoComp = infoComp[0];
      this.logoComp = infoComp[0].logoComp;
    })
  }

  ngOnInit() {

    if (!this.biosecurity) {

      this.breadcrumb.push(
        { url: '/home/homePage', name: 'Inicio' },
        { url: '../../../../../../home/regformats', name: 'Reportes' },
      );
    } else {
      this.breadcrumb.push(
        { url: "/home/homePage", name: "Inicio" },
        { url: '/home/biosecurity', name: `Bioseguridad` },
        { url: '', name: `Reportes` }

      );
    }

    this.serviceWplace.listByIdComp(this.idComp).subscribe(workspla => {
      this.workPlaces = workspla;
      this.infoComp = { ...this.infoComp, numWorkplaces: this.workPlaces.length };
      this.percentage = '0';
    });
    this.getData();
    this.getFormat();
    this.getVersion();
  }

  /* openAllFirst() {
    this.accordion.openAll();
  } */

  dataForRxcel() {
    console.log(this.infoComp, this.infoReport, this.dataForm);
  }

  async getData() {

    var sections: any[] = await this.getSections(this.idVer);
    this.percentagePart = 100 / sections.length;
    // console.log("SA: ", sections);

    var questions: any[] = await this.getQuestions(this.idVer);
    // console.log("Q: ", questions);

    // Set section id's to each question obtained
    for (var i = 0; i < sections.length; i++) {
      var ques = new Array();
      var idSec = sections[i]['id_sec'];

      for (var j = 0; j < questions.length; j++) {
        var idSecQues = questions[j]['id_sec'];
        if (idSecQues === idSec) {
          ques.push("ques_" + questions[j]['id_ques']);
        }
      }
      sections[i]['id_rf'] = this.idRf;
      sections[i]['id_questions'] = ques;
    }
    // console.log("SD: ", sections);

    // Get answers for each section obtained
    for (var i = 0; i < sections.length; i++) {
      // var section = JSON.stringify(sections[i]);
      var section = sections[i];
      this.percentageProgress = this.percentagePart * i;

      this.percentage = this.percentageProgress.toString();
      var info: any[] = await this.getSectionDataReport(section);

      if (info.length != 0) {
        this.dataReport.push(info[0]);
      }/*  else {
        console.log("error");
      } */
    }

    // console.log("DP: ", this.dataReport);

    // Get option values ​​for field of type multiple selection and separation of responses type file
    for (var i = 0; i < questions.length; i++) {
      // Construcción de datos en bd
      var idSQ = questions[i]['id_sec'];
      var idQ = questions[i]['id_ques'];
      var tpQ = questions[i]['type_ques'];

      let indice = this.dataReport.findIndex(sec => sec.id_section === idSQ);

      if (indice >= 0) {
        var name_field: string;
        var id_optv: string;
        var info_ov: any[];
        name_field = 'ques_' + idQ;
        id_optv = this.dataReport[indice][name_field];

        if (tpQ === 'radio_button_checked') {
          // this is a objec with {id, observation}
          if (id_optv != null) {
            const objquest = JSON.parse(id_optv);
            var tpRes = typeof (objquest);

            if (tpRes === 'object') {
              // const objquest = JSON.parse(id_optv);
              info_ov = await this.getOptValData(objquest.id);
              this.dataReport[indice][name_field] = { name: info_ov[0]['nameOptValue'], observacion: objquest.observacion };
            } else {
              info_ov = await this.getOptValData(id_optv);
              this.dataReport[indice][name_field] = { name: info_ov[0]['nameOptValue'] };
            }
          } else {
            this.dataReport[indice][name_field] = { name: '' };
          }
        } else if (tpQ === 'arrow_drop_down_circle') {

          info_ov = await this.getOptValData(id_optv);
          this.dataReport[indice][name_field] = info_ov[0]['nameOptValue'];
        }
        else if (tpQ === 'check_box') {
          var splitOptVal = id_optv.split(',');
          var strVal = '';
          for (var j = 0; j < splitOptVal.length; j++) {
            var idOptVal = splitOptVal[j];
            info_ov = await this.getOptValData(idOptVal);

            if (j === splitOptVal.length - 1) {
              strVal += info_ov[0]['nameOptValue'];
            } else {
              strVal += info_ov[0]['nameOptValue'] + ', ';
            }

            this.dataReport[indice][name_field] = strVal;
          }
        }
        else if (tpQ === 'cloud_upload') {
          var splitOptVal = [''];
          if (id_optv != null) {
            splitOptVal = id_optv.split(';');
          }
          this.dataReport[indice][name_field] = splitOptVal;
        } else if (tpQ === 'event') {
          var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
          var date = new Date(id_optv);
          var resDate = date.toLocaleString("es-ES", options);
          this.dataReport[indice][name_field] = resDate;
        }
        else if (tpQ === 'collaborator') {
          if (id_optv != null && id_optv != '') {

            var splitOptVal = id_optv.split(',');
            var strVal = '';
            for (var j = 0; j < splitOptVal.length; j++) {
              var idOptVal = splitOptVal[j];
              const coll = await this.getOptValColl(idOptVal);

              if (j === splitOptVal.length - 1) {
                strVal += coll.nameCol + ' ' + coll.lastnameCol;
              } else {
                strVal += coll.nameCol + ' ' + coll.lastnameCol + ', ';
              }

              this.dataReport[indice][name_field] = strVal;
            }

          }
        }
      } else {
        questions.splice(i, 1);
        i = i - 1;
      }
    }

    // console.log("DP: ", this.dataReport);

    // Group questions by section name to display data
    var arrayTemporal = [];
    var arrQues = {};
    for (var i = 0; i < questions.length; i++) {
      arrayTemporal = this.infoReport.filter(resp => resp["name_sec"] == questions[i]["name_sec"])
      if (arrayTemporal.length > 0) {
        arrQues = {
          id_ques: questions[i]["id_ques"],
          name_ques: questions[i]["name_ques"],
          type_ques: questions[i]["type_ques"],
          item_value: questions[i]["item_value"],
          order_ques: questions[i]["order_ques"]
        };
        this.infoReport[this.infoReport.indexOf(arrayTemporal[0])]["questions"].push(arrQues)
      } else {
        arrQues = {
          id_ques: questions[i]["id_ques"],
          name_ques: questions[i]["name_ques"],
          type_ques: questions[i]["type_ques"],
          item_value: questions[i]["item_value"],
          order_ques: questions[i]["order_ques"]
        };

        const section = sections.find(objsec => objsec['name_sec'] === questions[i]['name_sec'])
        this.infoReport.push({ "name_sec": questions[i]["name_sec"], "order_sec": section['order_fs'], "questions": [arrQues] })
      }
    }

    // console.log("IRA: ", this.infoReport);

    for (var i = 0; i < this.infoReport.length; i++) {

      var nameSec = this.infoReport[i]['name_sec'];
      let indice = this.dataReport.findIndex(sec => sec.name_sec === nameSec);

      for (var j = 0; j < this.infoReport[i]['questions'].length; j++) {
        var idQues = this.infoReport[i]['questions'][j]['id_ques'];
        var fieldRes = 'ques_' + idQues;
        var resQues = this.dataReport[indice][fieldRes];
        this.infoReport[i]['questions'][j]['res_ques'] = resQues;
      }
    }

    this.infoReport = this.infoReport.sort((a, b) => a.order_sec - b.order_sec)
    // console.log("IRD: ", this.infoReport);
    // console.log("DRD: ", this.dataReport);
  }

  getFormat() {
    // this.serviceForm.formById(this.idForm).subscribe(form => {
    this.serviceForm.formByIdRf(this.idForm).subscribe(form => {
      this.dataForm = form;
      // console.log("DF: ", this.dataForm);
      this.nameForm = this.dataForm['nameFormat'];
    });
  }

  getVersion() {
    this.serviceVer.getById(this.idVer).subscribe(version => {
      this.dataVersion = version;
      this.codVersion = this.dataVersion['codVersion'];
      this.numVersion = this.dataVersion['version'];
      this.dateVersion = this.dataVersion['dateCreated'];
      this.breadcrumb.push({ url: '', name: `Ver reporte ${this.codVersion}` });
    });
  }

  async getSections(idVer) {
    var sections = await this.serviceVerSec.listByIdVersionInfoSection(idVer).toPromise();
    //var optvalues = this.buildOptValues(options);
    return sections;
  }

  async getQuestions(idVer) {
    var questions = await this.serviceVerQues.listByIdVersionInfoSection(idVer).toPromise();
    return questions;
  }

  async getSectionDataReport(params) {
    var info = await this.service.dataSectionReport(params).toPromise();
    return info;
  }

  async getOptValData(idoptval) {
    var optval = await this.serviceOptVal.gerByIdOptVal(idoptval).toPromise();
    return optval;
  }

  async getOptValColl(idoptval) {
    var optval = await this.collService.getCollaboratorsById(idoptval).toPromise();
    return optval;
  }

  fileDownload(url) {
    let link = document.getElementById(url);
    link.setAttribute('href', url);
  }

  downloadReportInExcel() {
    if (this.dataForm['codFormat'] == 'SST-FT-01') {
      this.service.generateExcelSGSST(this.dataForm, this.infoComp, this.infoReport, this.dataVersion)
    } else {
      this.infoReport = this.infoReport.sort((a, b) => a.order_sec - b.order_sec)
      this.service.generateQuestionsFormat(this.dataForm, this.infoReport, this.dataVersion, this.infoComp)
    }
  }

}
