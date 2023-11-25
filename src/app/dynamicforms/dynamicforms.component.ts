import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { finalize, map } from 'rxjs/operators';
import { snackError, snackOk } from '../util/snackbar-util';
import { FieldConfig, Validator } from './field.interface';
import { CompformatService } from '../compformat/services/compformat.service';
import { FormatsService } from '../formats/services/formats.service';
import { CompaniesService } from '../companies/services/companies.service';
import { FormsectionService } from '../formsection/services/formsection.service';
import { QuestionsService } from '../questions/services/questions.service';
import { ConditionsService } from '../conditions/services/conditions.service';
import { OptvaluesService } from '../optvalues/services/optvalues.service';
import { SectionsService } from '../sections/services/sections.service';
import { DynamicformsService } from './services/dynamicforms.service';
import { SessionService } from '../..//app/core/services/session.service';
import { validate } from '../util/http-util';
import { VersionsService } from '../versions/services/versions.service';
import { environment } from 'src/environments/environment';
import { SectionFormComponent } from './components/section-form/section-form.component';
import { ArRegisterFormat } from '../shared/models/arRegisterFormat';
import { DependenciesService } from '../dependencies/services/dependencies.service';
import { UploadFileService } from './services/upload-file.service';
import { MatDialog } from '@angular/material/dialog';
import { FileItem } from './models/FileItem';
import { WorkplacesService } from '../workarea/services/workplaces.service';
import { CollaboratorserviceService } from '../collaborators/services/collaboratorservice.service';
import { AcsCollaborator } from '../shared/models/acscollaborator.model';
import { Operator } from '../dependencies/services/operators.service';

@Component({
  selector: 'app-dynamicforms',
  templateUrl: './dynamicforms.component.html',
  styleUrls: ['./dynamicforms.component.scss'],
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class DynamicformsComponent implements OnInit {

  @ViewChild(SectionFormComponent, { static: true }) form: SectionFormComponent;
  // @ViewChild(DynamicFormComponent, { static: true }) form: any;
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;
  dataCf = new Array();
  dataForm = new Array();
  dataVersion = new Array();
  dataFs = new Array();
  dataComp = new Array();
  dataQuestions = new Array();
  dataSec = new Array();
  dataSecs = new Array();
  breadcrumb = new Array();
  condQues = new Array();
  dataValues = new Array();
  idCf: number;
  idSec: number;
  nameForm: string;
  nameComp: string;
  logoComp: string;
  tableName: string;
  codVersion: string;
  numVersion: number;
  dateVersion: string;
  error: string;
  loading = false;
  idSections = new Array();

  upFile: boolean;
  anyFile = false;
  filesToUpload2: FileItem[] = [];
  filesToUpload: MatTableDataSource<FileItem>;
  displayedColumns: string[] = ['Nombre', 'Tamaño', 'progreso'];
  showTableFiles = false;

  dataFields = new Array();
  regConfig: FieldConfig[] = [];

  registerFormat = new ArRegisterFormat();
  workplaces = [];
  workPlaceSelected = -1;

  typeFormat = '';
  idComp: number;
  collaborators: AcsCollaborator[] = [];
  CollaboratorSelected: AcsCollaborator;
  viewSections = true;

  percentagePart: number;
  percentageProgress: number;
  percentage: string;

  constructor(private activateRoute: ActivatedRoute, private service: CompformatService, private serviceForm: FormatsService,
    private serviceComp: CompaniesService, private serviceFs: FormsectionService, private serviceQues: QuestionsService,
    private serviceCond: ConditionsService, private serviceOptVal: OptvaluesService, private serviceSec: SectionsService,
    private serviceDynForm: DynamicformsService, private snackbar: MatSnackBar, private router: Router, private session: SessionService,
    private serviceVer: VersionsService, private serviceDep: DependenciesService, private storeService: UploadFileService,
    public dialogFile: MatDialog, private workplaceservice: WorkplacesService, private collService: CollaboratorserviceService) {

    this.idComp = Number(JSON.parse(localStorage.getItem('idComp')));

  }

  ngOnInit() {

    this.activateRoute.params.subscribe(params => {
      if (params['id_cf'] && params['id_ver']) {
        this.idCf = params['id_cf'];
        this.registerFormat.idVersion = params['id_ver'];
        this.getCf();
        this.percentage = '3';
      }
    });

    this.loadWorkPlaces();
    // this.proofForm();
  }

  cambiarSteper() {
    document.querySelector('#cdk-step-label-0-0').setAttribute("editable", "false");
    /*  document.querySelector('#cdk-step-label-0-1').setAttribute("ng-reflect-active", "false");
     document.querySelector('#cdk-step-label-0-1').setAttribute("aria-selected", "false");
     document.querySelector('#cdk-step-label-0-1').setAttribute("ng-reflect-selected", "false");
     document.querySelector('#cdk-step-label-0-1').setAttribute("ng-reflect-index", "1");
     document.querySelector('#cdk-step-label-0-1').setAttribute("tabindex", "-1"); */
  }

  getCollaborators() {
    this.collService.getCollaboratorsByIdComp(this.idComp).subscribe(colls => this.collaborators = colls);
  }

  loadWorkPlaces() {
    this.workplaceservice.listByIdComp(this.idComp).subscribe(listWorks => this.workplaces = listWorks)
  }

  selectColl() {
    console.log(this.CollaboratorSelected);
    this.viewSections = true;
  }

  getCf() {
    this.service.cfById(this.idCf).subscribe(cf => {
      this.dataCf = cf;
      this.registerFormat.idUser = Number.parseInt(this.session.idUser);
      this.registerFormat.idComp = this.dataCf['idComp']
      this.registerFormat.idFormat = this.dataCf['idFormat'];
      this.registerFormat.initDateRf = new Date()
      this.getComp();
      this.getFormat();
      // this.getVersion();
      this.getFs();
      this.breadcrumb = [
        { url: '/home/homePage', name: 'Inicio' },
        { url: '../../../../home/companies', name: 'Empresas' }
      ];
    });
  }

  getComp() {
    this.serviceComp.compById(this.registerFormat.idComp).subscribe(company => {
      this.dataComp = company;
      this.nameComp = this.dataComp[0]['nameComp'];
      this.logoComp = this.dataComp[0]['logoComp'];
      this.breadcrumb.push({ url: `../../../../home/compformat/id_comp/${this.registerFormat.idComp}`, name: `Formatos ${this.nameComp}` });
    });
  }

  getFormat() {
    this.serviceForm.formById(this.registerFormat.idFormat).subscribe(format => {
      this.dataForm = format;
      this.typeFormat = format['typeFormat'];
      if (this.typeFormat === 'BS') {
        this.viewSections = false;
        this.getCollaborators();
      }
      this.nameForm = this.dataForm['nameFormat'];
      this.breadcrumb.push({ url: `../../../versions/id_cf/${this.idCf}`, name: `Versiones ${this.nameForm}` });
      this.getVersion();
    });
  }

  getVersion() {
    this.serviceVer.getById(this.registerFormat.idVersion).subscribe(version => {
      this.dataVersion = version;
      this.codVersion = this.dataVersion['codVersion'];
      this.numVersion = this.dataVersion['version'];
      this.dateVersion = this.dataVersion['dateCreated'];
      this.breadcrumb.push({ url: '', name: `Diligenciar ${this.codVersion}` });
    });
  }

  getFs() {
    this.serviceFs.listByIdFormFill(this.registerFormat.idFormat, this.registerFormat.idVersion).subscribe(fs => {
      this.dataFs = fs;
      this.dataSecs = fs;
      console.log("this.dataFs: ", this.dataFs);
      
      var numSecs = this.dataFs.length;

      this.percentagePart = 100 / numSecs;

      let validate = numSecs;
      if (validate === 0) {
        this.error = "Este formato no contiene secciones";
        snackError(this.snackbar, 'Este formato no contiene secciones');
        return false;
      }

      // for (const dfs of this.dataFs) {
      //   this.idSections.push(dfs['id_sec']);
      // }
      this.getSections();
    });
  }

  /* async getValidators(idQues) {
    var conditions = await this.serviceCond.listByIdQues(idQues).toPromise();
    var validators = this.buildValidations(conditions);

    return validators;
  } */

  async getSections() {
    // for (const ids of this.idSections) {
    //   var sections = await this.serviceSec.secById(ids).toPromise();
    //   this.dataSecs.push(sections);
    // }

    for (const ds of this.dataSecs) {
      var questions = await this.serviceQues.listByIdSecFill(ds['id_sec'], this.registerFormat.idVersion).toPromise();
      this.dataQuestions.push(questions);
    }

    this.buildQuestions(0, 0);
  }

  buildQuestions(iterator, index) {
    for (let i = 0; i < this.dataQuestions.length; i++) {
      let validate = this.dataQuestions[i].length;
      if (validate === 0) {
        this.error = "Una de las secciones no contiene preguntas";
        snackError(this.snackbar, 'Una de las secciones no contiene preguntas');
        return false;
      }
    }

    let ques = this.dataQuestions[iterator][index];
    let typeQues = ques['typeQues'];


    let here = this;
    switch (typeQues) {
      case 'short_text':
      case 'money':
        this.buildInput(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'notes':
        this.buildTextArea(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'radio_button_checked':
        this.buildRadioButtons(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'check_box':
        this.buildCheckBoxes(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'arrow_drop_down_circle':
        this.buildSelect(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'cloud_upload':
        this.buildFileInput(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'event':
        this.buildDatePicker(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
      case 'collaborator':
        this.buildCollaborator(ques, iterator).then(function (data) {
          here.setFormField(iterator, index, data);
        });
        break;
    }
  }

  async setFormField(iterator, index, object) {

    this.percentageProgress = this.percentagePart * iterator;
    if (this.percentageProgress > 3) {
      this.percentage = this.percentageProgress.toString();
    }

    let dfl = this.dataFields.length;

    // agregar las dependencias
    object.dependencies = await this.getDependencies(object);

    if (dfl === 0) { // If no section has yet been built
      this.dataFields.push(
        [object]
      );
    } else { // If there is already at least one section and question built
      let dfll = dfl - 1; // Exact position of the current section
      if (dfll === iterator) { // If the iterator remains the same as the section under construction
        this.dataFields[iterator].push(object);

        /*let dflb = this.dataFields[iterator].length;
        let dql = this.dataQuestions[iterator].length;
         if (dflb === dql) { // If the number of questions built in the current section is equal to the original
          this.dataFields[iterator].push(
            {
              type: 'button',
              label: 'Siguiente'
            }
          );
        } */
      } else { // If you start building a new section
        this.dataFields.push(
          [object]
        );
      }
    }

    if (iterator < this.dataQuestions.length) { // As long as the iterator is still less than the number of sections
      if (index + 1 < this.dataQuestions[iterator].length) { // As long as the next index is still lower than the question quality in the current section
        this.buildQuestions(iterator, index + 1);
      } else if (index + 1 === this.dataQuestions[iterator].length) { // If the next index is the same as the question cathood in the current section
        if (iterator + 1 < this.dataQuestions.length) { // If the next iterator is still less than the number of sections
          this.buildQuestions(iterator + 1, 0);
        } else { // If the next iterator exceeds the number of sections
          this.regConfig = this.dataFields;
        }
      }
    } else { // If the next iterator exceeds the number of sections
      this.regConfig = this.dataFields;
      this.cambiarSteper()
    }
  }

  async buildInput(ques, it) {
    let idQues = ques.idQues;
    let typeQues = ques.typeQues;
    let inputType: string;
    let nameSec = this.dataSecs[it].name_sec;

    if (typeQues === 'short_text') {
      inputType = 'text';
    } else if (typeQues === 'money') {
      inputType = 'number';
    }

    let nameQues = this.convertName(idQues);
    var validators: any[] = await this.getValidators(idQues);

    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: idQues,
        type: typeQues,
        inputType: inputType,
        label: ques.nameQues,
        name: nameQues,
        description: ques.descQues,
        information: ques.infoQues,
        validations: validators,
        nameSection: nameSec
      }
    );

    return arrQues;
  }

  async buildTextArea(ques, it) {
    let idQues = ques.idQues;
    let nameSec = this.dataSecs[it].name_sec;

    let nameQues = this.convertName(idQues);
    var validators: any[] = await this.getValidators(idQues);

    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        description: ques.descQues,
        information: ques.infoQues,
        validations: validators,
        nameSection: nameSec
      }
    );

    return arrQues;
  }

  async buildRadioButtons(ques, it) {
    let idQues = ques.idQues;
    let idOpt = ques.idOpt;
    let nameQues = this.convertName(idQues);
    let nameSec = this.dataSecs[it].name_sec;
    let itemValue = ques.itemValue ? ques.itemValue : null;
    var optvalues: any[] = await this.getOptValues(idOpt);

    let validators = new Array();
    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        options: optvalues,
        // value: "Male",
        validations: validators,
        nameSection: nameSec,
        itemValue,
      }
    );

    return arrQues;
  }

  async buildCheckBoxes(ques, it) {
    let idQues = ques.idQues;
    let idOpt = ques.idOpt;
    let nameQues = this.convertName(idQues);
    let nameSec = this.dataSecs[it].name_sec;

    var optvalues: any[] = await this.getOptValues(idOpt);

    let validators = new Array();
    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        options: optvalues,
        nameSection: nameSec,
        validations: validators
        // value: false
      }
    );

    return arrQues;
  }

  async buildSelect(ques, it) {
    let idQues = ques.idQues;
    let idOpt = ques.idOpt;
    let nameQues = this.convertName(idQues);
    let nameSec = this.dataSecs[it].name_sec;

    var optvalues: any[] = await this.getOptValues(idOpt);

    let validators = new Array();
    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        information: ques.infoQues,
        // value: "UK",
        options: optvalues,
        validations: validators,
        nameSection: nameSec
      }
    );

    return arrQues;
  }

  async buildCollaborator(ques, it) {
    let idQues = ques.idQues;
    let idOpt = ques.idOpt;
    let nameQues = this.convertName(idQues);
    let nameSec = this.dataSecs[it].name_sec;
    let itemValue = ques.itemValue ? ques.itemValue : null;

    let validators = new Array();
    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        information: ques.infoQues,
        validations: validators,
        nameSection: nameSec,
        itemValue
      }
    );

    return arrQues;
  }

  async buildFileInput(ques, it) {
    this.upFile = true;
    let idQues = ques.idQues;
    let nameQues = this.convertName(idQues);
    let nameSec = this.dataSecs[it].name_sec;

    var formats: any[] = await this.getValidators(idQues);

    let accept = '.jpeg, .jpg, .png, .pdf, .xls, .xlsx, .csv, .doc, .docx, .odt';
    let error = 'Archivo inválido. Solo se permiten las extensiones: (' + accept + ')';
    let limit_file = 1;

    if (formats.length != 0) {
      accept = formats[0]['accept'] ? formats[0]['accept'] : accept;
      error = formats[0]['message'] ? formats[0]['message'] : error;

      let indFileLimit = formats.findIndex(lim => lim.name === 'file_limit');
      if (indFileLimit >= 0) {
        limit_file = formats[indFileLimit]['limit_file'] ? formats[indFileLimit]['limit_file'] : limit_file;
      }
    }

    let validators = new Array();
    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        accept: accept,
        error: error,
        validations: validators,
        nameSection: nameSec,
        limit_file
      }
    );

    return arrQues;
  }

  async buildDatePicker(ques, it) {
    let idQues = ques.idQues;
    let nameSec = this.dataSecs[it].name_sec;

    let nameQues = this.convertName(idQues);
    var validators: any[] = await this.getValidators(idQues);

    if (ques.mandatoryQues) {
      validators.push(
        {
          name: 'required',
          validator: Validators.required,
          message: 'Campo requerido'
        }
      );
    }

    let arrQues = new Object(
      {
        id: ques.idQues,
        type: ques.typeQues,
        label: ques.nameQues,
        name: nameQues,
        description: ques.descQues,
        information: ques.infoQues,
        validations: validators,
        nameSection: nameSec
      }
    );

    return arrQues;
  }

  async getValidators(idQues) {
    var conditions = await this.serviceCond.listByIdQues(idQues).toPromise();
    var validators = this.buildValidations(conditions);
    return validators;
  }

  async getDependencies(ques) {
    var idQues = ques.id
    var dependencies = await this.serviceDep.loadQuestionDependency(idQues, 1).toPromise();
    var mapDepen
    var lst = new Array()
    var id = 0
    for (let i = 0; i < dependencies.length; i++) {
      const depen = dependencies[i];
      if (i == 0) {
        id = depen.id_quesfather;
        lst.push(depen)
      } else {
        if (id == depen.id_quesfather) {
          lst.push(depen)
        } else {
          if (!mapDepen) mapDepen = {}
          mapDepen[id.toString() + ';ques'] = lst
          id = depen.id_quesfather
          lst = new Array()
          lst.push(depen)
        }
      }
      if (i == dependencies.length - 1) {
        if (!mapDepen) mapDepen = {}
        mapDepen[id.toString() + ';ques'] = lst
      }
    }
    if (!mapDepen) {
      ques.visibilityQues = true
    }
    return mapDepen;
  }

  async getOptValues(idOpt) {
    var options = await this.serviceOptVal.listByIdOptAssets(idOpt).toPromise();
    //var optvalues = this.buildOptValues(options);
    return options;
  }

  buildOptValues(optQues) {
    let optvalues = new Array();

    for (const opt of optQues) {
      let stateOptValue = opt['stateOptValue'];
      let nameOptValue = opt.nameOptValue.toString();

      if (stateOptValue) {
        optvalues.push(nameOptValue);
      }
    }

    return optvalues;
  }
  // typeCond:'file_limit'
  // valueCond:'6'
  buildValidations(condQues) {
    let validators = new Array();

    for (const cond of condQues) {
      let typeCond = cond['typeCond'];
      let valueCond = cond['valueCond'];
      if (typeCond === 'lenght') {
        switch (cond['operatorCond']) {
          case '[]':
            var splitVal = cond['valueCond'].split('-');
            validators.push(
              {
                name: 'minlength',
                validator: Validators.minLength(splitVal[0]),
                message: cond['messageCond']
              },
              {
                name: 'maxlength',
                validator: Validators.maxLength(splitVal[1]),
                message: cond['messageCond']
              }
            );
            break;
          case '<':
            validators.push(
              {
                name: 'maxlength',
                validator: Validators.maxLength(cond['valueCond']),
                message: cond['messageCond']
              }
            );
            break;
          case '>':
            validators.push(
              {
                name: 'minlength',
                validator: Validators.minLength(cond['valueCond']),
                message: cond['messageCond']
              }
            );
            break;
        }
      } else if (typeCond === 'type') {
        if (valueCond === 'email') {
          validators.push(
            {
              name: 'pattern',
              validator: Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
              message: cond['messageCond']
            }
          );
        }
      } else if (typeCond === 'min' || typeCond === 'mindate') {
        validators.push(
          {
            name: 'min',
            validator: Validators.min(valueCond),
            message: cond['messageCond'],
            value: valueCond
          }
        );
      } else if (typeCond === 'max' || typeCond === 'maxdate') {
        validators.push(
          {
            name: 'max',
            validator: Validators.max(valueCond),
            message: cond['messageCond'],
            value: valueCond
          }
        );
      } else if (typeCond === 'warning') {
        validators.push(
          {
            name: 'warning',
            message: cond['messageCond'],
            value: valueCond,
            operator: cond['operatorCond']
          }
        )
      }
    }

    return validators;
  }

  convertName(id) {
    let nameQues = 'ques_' + id;
    return nameQues;
  }

  submit(value: any, step) {

    let idWp = this.registerFormat.idWorkplace;

    if (idWp) {
      console.log("this.dataSecs: ", this.dataSecs);
      
      let dsl = this.dataSecs.length;

      /*  value['idForm'] = this.registerFormat.idFormat;
       value['idUser'] = this.registerFormat.idUser;
       value['idVer'] = this.registerFormat.idVersion;
       value['idComp'] = this.registerFormat.idComp; */

      // value['idSec'] = this.dataSecs[step].idSection;
      // value['tableName'] = this.dataSecs[step].tableName;
      value['idSec'] = this.dataSecs[step].id_sec;
      value['tableName'] = this.dataSecs[step].table_name;
      console.log("value: ", value);
      
      this.dataValues[step] = value;

      let rc = new Array();
      rc.push(this.regConfig[step]);

      // if (this.upFile) {
      for (let i = 0; i < rc[0].length; i++) {
        let type = rc[0][i].type;
        let id = rc[0][i].id;
        let colques = 'ques_' + id;
        const itemValue = rc[0][i].itemValue ? rc[0][i].itemValue : null;

        console.log("rc[0][i]: ", rc[0][i]);
        console.log("itemValue: ", itemValue);
        


        if (type === 'radio_button_checked') {
          if (value[colques] != null) {
            // #TODO
            value[colques] = JSON.stringify(rc[0][i].value);
          }

        }
      }

      console.log("value: ", value);
      

      if (step === dsl - 1) { // If the current step is the last section}
        this.saveRegister();

      } else {
        this.stepper.next();
      }
    } else {
      document.getElementById('fieldWPlace').focus();
      snackError(this.snackbar, `Seleccione un puesto de trabajo para continuar`);
    }
  }

  logRegister() {
    this.registerFormat.idWorkplace = this.workPlaceSelected
  }

  saveRegister() {
    this.registerFormat.idWorkplace = this.workPlaceSelected ? this.workPlaceSelected : null;
    this.registerFormat.finDateRf = new Date()
    this.serviceDynForm.insert({ sections: this.dataValues, registerFormat: this.registerFormat })
      .pipe(
        finalize(() => this.loading = false)
      ).subscribe(() => this.editOk(), () => {
        const msn = this.workPlaceSelected != -1 ? "" : 'Seleccione un Puesto de trabajo'
        snackError(this.snackbar, `Error al guardar ${msn}`)
      });
  }

  editOk() {
    snackOk(this.snackbar, 'Guardado');
    this.router.navigate([`/home/versions/id_cf/${this.idCf}`], { relativeTo: this.activateRoute });
  }

  exampleMethodParentDynamic($event) {
    this.dataFields.forEach(dataField => {
      dataField.forEach(actualQuestion => {
        if (actualQuestion.dependencies) {
          var cumpleValidations = new Array()

          for (let mapDepen in actualQuestion.dependencies) {
            var value = actualQuestion.dependencies[mapDepen]
            var cumple = false;
            value.forEach(questionD => {
              //ver las respuestas de las demas preguntas
              this.dataFields.forEach(modules => {
                for (let i = 0; i < modules.length; i++) {
                  const questionDependency = modules[i];
                  if (questionDependency.id == questionD.id_quesfather) {
                    if (this.evaluateConditionQuestionDependency(questionDependency, questionD)) {
                      cumple = true;
                      break
                    }
                  }
                }
              });
            });
            cumpleValidations.push(cumple);
          }
          //tiene algun false
          if (cumpleValidations.indexOf(false) > -1) {
            actualQuestion.visibilityQues = false
            actualQuestion.value = null
          } else {
            actualQuestion.visibilityQues = true
          }
        }
      });
    });
  }

  evaluateConditionQuestionDependency(question, dependency) {
    var response = false, error = false
    var condition = dependency.operator_dep;
    var value = dependency.value_dep;
    var responseFloat: any;
    try {
      switch (question.type) {
        case 'short_text':
        case 'money':
          if (question.value != null && question.value != "") {
            responseFloat = Number(question.value);
          } else {
            error = true;
          }
          break;
        case 'arrow_drop_down_circle':
        case 'radio_button_checked':
          if (question.type && question.itemValue) {
            responseFloat = question.value.id
          } else if (question.value != null && question.value != 0) {
            responseFloat = question.value;
          } else {
            error = true;
          }
          break;
        case 'check_box':
          if (question.value && question.value.length > 0) {
            responseFloat = question.value;
          } else {
            error = true;
          }

          break;
        default:
          error = true
          break
      }

      if (!error) {
        switch (condition) {
          case "<":
            if (responseFloat < Number(value)) {
              response = true;
            }
            break;
          case "<=":
            if (responseFloat <= Number(value)) {
              response = true;
            }
            break;
          case ">":
            if (responseFloat > Number(value)) {
              response = true;
            }
            break;
          case ">=":
            if (responseFloat >= Number(value)) {
              response = true;
            }
            break;
          case "==":
            if (question.type == 'check_box' && responseFloat.indexOf(Number(value)) > -1) {
              response = true;
            } else if (responseFloat == Number(value)) {
              response = true;
            }
            break;
          /*case "()":
              if (responseFloat > value1 && responseFloat < value2) {
                  response = true;
              }
              break;
          case "(]":
              if (responseFloat > value1 && responseFloat <= value2) {
                  response = true;
              }
              break;
          case "[)":
              if (responseFloat >= value1 && responseFloat < value2) {
                  response = true;
              }
              break;
          case "[]":
              if (responseFloat >= value1 && responseFloat <= value2) {
                  response = true;
              }
              break;*/
        }
      }
    } catch (error) {
      console.log('Error evaluateConditionQuestionDependency ', error);
    }
    return response
  }
}
