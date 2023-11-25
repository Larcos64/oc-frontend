import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { finalize } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { QuestionsService } from "../services/questions.service";
import { OptionsService } from "../../options/services/options.service";
import { OptvaluesService } from "../../optvalues/services/optvalues.service";
import { AddOptionDialogComponent } from "../add-option-dialog/add-option-dialog.component";
import { MatSnackBar } from "@angular/material";
import { snackError, snackOk } from "../../util/snackbar-util";
import { ActQues } from "../../shared/models/actquestion.model";
import { ActOption } from "../../shared/models/actoption.model";
import { ActOptionValue } from "../../shared/models/actoptionvalue.model";

@Component({
  selector: "app-add-question",
  templateUrl: "./add-question.component.html",
  styleUrls: ["./add-question.component.scss"],
})
export class AddQuestionComponent implements OnInit {
  idSection: number;
  selectedType: string;
  questionFormGroup: FormGroup;
  optionFormGroup: FormGroup;

  question = new ActQues();
  option = new ActOption();
  optval = new ActOptionValue();
  dataOptVal = {};
  loading = false;
  mandQuest = false;

  columnsOption: string[] = ["option", "code", "state", "actions"];
  dataSource: MatTableDataSource<any>;

  addOptDialogRef: MatDialogRef<AddOptionDialogComponent>;

  listTypes = [
    /* { value: 'short_text', type: 'Respuesta Corta', icon: 'short_text' }, */
    /* { value: 'notes', type: 'Párrafo', icon: 'notes' }, */
    {
      value: "radio_button_checked",
      type: "Varias opciones",
      icon: "radio_button_checked",
    },
    { value: "check_box", type: "Casillas", icon: "check_box" },
    {
      value: "arrow_drop_down_circle",
      type: "Desplegable",
      icon: "arrow_drop_down_circle",
    },
    /* { value: 'cloud_upload', type: 'Subir Archivo', icon: 'cloud_upload' }, */
    /* { value: 'event', type: 'Fecha', icon: 'event' }, */
    /* { value: 'access_time', type: 'Hora', icon: 'access_time' }, */
    /* { value: 'collaborator', type: 'Colaborador', icon: 'group' } */
  ];

  styles: number[] = [1, 2, 3];
  dataOptions = new Array();

  avOptions = false;
  // avConditions = false;

  constructor(
    private router: Router,
    private service: QuestionsService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private serviceOpt: OptionsService,
    private serviceOptVal: OptvaluesService
  ) {}

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      this.idSection = params["id_sec"];
    });

    this.questionFormGroup = this.fb.group({
      idSec: [this.idSection, Validators.required],
      idOpt: [],
      nameQues: ["", [Validators.required, Validators.maxLength(300)]],
      descQues: ["", [Validators.required, Validators.maxLength(500)]],
      typeQues: ["", Validators.required],
      infoQues: ["", Validators.required],
      mandatoryQues: [this.mandQuest, Validators.required],
      itemValue: [""],
    });

    this.optionFormGroup = this.fb.group({
      nameOption: ["", [Validators.required, Validators.maxLength(200)]],
      descOption: ["", [Validators.required, Validators.maxLength(300)]],
      codOption: ["", [Validators.required, Validators.maxLength(30)]],
    });

    // this.conditionFormGroup = this.fb.group({
    //   typeCont: ['', Validators.required],
    //   operatorCond: [''],
    //   valueCond: [''],
    //   messageCond: ['', Validators.required],
    // });

    this.getOptions();
  }

  getOptions() {
    this.dataSource = new MatTableDataSource(this.dataOptions);
  }

  // convenience getter for easy access to form fields
  get qfg() {
    return this.questionFormGroup.controls;
  }

  // convenience getter for easy access to form fields
  get ofg() {
    return this.optionFormGroup.controls;
  }

  changeMandatory(ob: MatSlideToggleChange) {
    if (ob.checked) {
      this.mandQuest = true;
      this.questionFormGroup.get("mandatoryQues").setValue(this.mandQuest);
    } else {
      this.mandQuest = false;
      this.questionFormGroup.get("mandatoryQues").setValue(this.mandQuest);
    }
  }

  startAddOpt(): void {
    this.addOptDialogRef = this.dialog.open(AddOptionDialogComponent, {
      width: "400px",
      height: "auto",
      closeOnNavigation: true,
      autoFocus: false,
      //data: { idComp: this.idComp }
    });

    this.addOptDialogRef.afterClosed().subscribe((result) => {
      this.dataOptions[this.dataOptions.length] = {
        nameOptValue: result[0]["nameOptValue"],
        codOptValue: result[0]["codOptValue"],
        stateOptValue: result[0]["stateOptValue"],
      };
      this.getOptions();
    });
  }

  deleteOption(index: number) {
    this.dataOptions.splice(index, 1);
    this.getOptions();
  }

  onTypeChange(tp) {
    this.selectedType = tp.value;
    if (
      this.selectedType === "radio_button_checked" ||
      this.selectedType === "check_box" ||
      this.selectedType === "arrow_drop_down_circle"
    ) {
      this.avOptions = true;
      // this.form.get("otherArlComp").setValidators([Validators.required]);
      // this.form.get('otherArlComp').enable();
      // this.form.get("otherArlComp").updateValueAndValidity();
    } else {
      this.avOptions = false;
      // this.form.get("otherArlComp").clearValidators();
      // this.form.get('otherArlComp').disable();
      // this.form.get("otherArlComp").updateValueAndValidity();
    }
  }

  saveOption() {
    this.option = new ActOption(this.optionFormGroup.value);
    this.loading = true;
    this.serviceOpt
      .add(this.option)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res) => this.buildOptValues(res),
        (err) => snackError(this.snackbar, err)
      );
  }

  buildOptValues(dataOption) {
    for (const opt of this.dataOptions) {
      this.dataOptVal = {
        idOpt: dataOption.idOption,
        nameOptValue: opt.nameOptValue,
        codOptValue: opt.codOptValue,
        stateOptValue: opt.stateOptValue,
      };

      this.saveOptValues(dataOption, this.dataOptVal);
    }
  }

  saveOptValues(dataOption, object) {
    this.optval = new ActOptionValue(object);
    this.serviceOptVal
      .add(this.optval)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this.saveQuestion(dataOption),
        (err) => snackError(this.snackbar, err)
      );
  }

  saveQuestion(dataOption) {
    if (dataOption) {
      this.questionFormGroup.get("idOpt").setValue(dataOption.idOption);
    }

    this.question = new ActQues(this.questionFormGroup.value);
    this.loading = true;
    this.service
      .add(this.question)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this.addOk(),
        (err) => snackError(this.snackbar, err)
      );
  }

  addOk() {
    snackOk(this.snackbar, "Pregunta registrada");
    // this.router.navigate([`../../home/sections`], { relativeTo: this.route });
    this.router.navigate([`home/sections`]);
  }
}
