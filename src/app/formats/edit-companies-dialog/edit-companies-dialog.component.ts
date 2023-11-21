import { Component, OnInit, Inject } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { finalize } from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { snackError, snackOk } from "../../util/snackbar-util";
import { CompaniesService } from "../../companies/services/companies.service";
import { CompformatService } from "../../compformat/services/compformat.service";
import { ActsCompFormat } from "../../shared/models/actscompformat.model";

@Component({
  selector: "app-edit-companies-dialog",
  templateUrl: "./edit-companies-dialog.component.html",
  styleUrls: ["./edit-companies-dialog.component.scss"],
})
export class EditCompaniesDialogComponent implements OnInit {
  form: FormGroup;
  companiesData = [];
  dataCompFormat = {};
  compFormat = new ActsCompFormat();
  compAssignment = new Array();
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCompaniesDialogComponent>,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public serviceComp: CompaniesService,
    public serviceCompFormat: CompformatService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      companies: new FormArray([]),
    });

    this.addCheckboxes();
  }

  addCheckboxes() {
    // Obtaining all existing companies
    this.serviceComp.list().subscribe((perm) => {
      this.companiesData = perm;
      // Obtaining all assignments for format
      this.serviceCompFormat
        .listByIdForm(this.data.idFormat)
        .subscribe((compformat) => {
          this.compAssignment = compformat;
          // Iteration of each existing companies to create checkbox
          this.companiesData.forEach((o, i) => {
            // Search by index of assigned companies to check automatically
            let indice = this.compAssignment.findIndex(
              (company) => company.idComp === o.idComp
            );
            if (indice >= 0) {
              // If it exists, check automatically
              var control = new FormControl(true);
            } else {
              // If it does not exist, do not check
              var control = new FormControl();
            }
            (this.form.controls.companies as FormArray).push(control);
          });
        });
    });
  }

  buildCompanies() {
    this.loading = true;

    // If the form is modified, the assignments are cleaned
    if (this.form.dirty) {
      this.delAssignmentsByIdForm(this.data.idFormat);
    }

    // Collection of selected companies indices
    const selectedCompIds = this.form.value.companies
      .map((v, i) => (v ? this.companiesData[i].idComp : null))
      .filter((v) => v !== null);

    // If any company is selected, these are assigned
    if (
      typeof selectedCompIds !== "undefined" &&
      selectedCompIds != null &&
      selectedCompIds.length != null &&
      selectedCompIds.length > 0
    ) {
      // Assignments update after 1 second to wait for cleaning
      setTimeout(() => {
        for (const idcomp of selectedCompIds) {
          this.dataCompFormat = {
            idComp: idcomp,
            idFormat: this.data.idFormat,
            stateCompFor: true,
          };

          this.saveAssignments(this.dataCompFormat);
        }
      }, 1000);
    } else {
      this.router.navigate(["home/formats"], { relativeTo: this.route });
      this.dialogRef.close();
    }
  }

  delAssignmentsByIdForm(idFormat) {
    this.serviceCompFormat
      .deleteByIdForm(idFormat)
      .pipe(finalize(() => (this.loading = true)))
      .subscribe(
        () => (this.loading = true),
        (err) => snackError(this.snackbar, err)
      );
  }

  saveAssignments(object) {
    this.compFormat = new ActsCompFormat(object);
    this.serviceCompFormat
      .add(this.compFormat)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this.addOk(),
        (err) => snackError(this.snackbar, err)
      );
  }

  addOk() {
    snackOk(this.snackbar, "Formatos asignados");
    this.loading = false;
    this.router.navigate(["home/formats"], { relativeTo: this.route });
    this.dialogRef.close();
  }
}
