import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material";
import { finalize } from "rxjs/operators";
import { ActFormat } from "../../shared/models/actformat.model";
import { snackError, snackOk } from "../../util/snackbar-util";
import { SessionService } from "src/app/core/services/session.service";
import { ActVersion } from "src/app/shared/models/actversion.model";
import { VersionsService } from "../services/versions.service";

@Component({
  selector: "app-add-version-dialog",
  templateUrl: "./add-version-dialog.component.html",
})
export class AddVersionDialogComponent implements OnInit {
  form: FormGroup;
  obj = new ActVersion();
  loading = false;
  edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private fb: FormBuilder,
    public service: VersionsService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<AddVersionDialogComponent>,
    private session: SessionService
  ) {
    if (data.objEdit) {
      this.edit = true;
      this.obj = data.objEdit;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    /* if (this.edit) {
      this.form = this.fb.group({
        idVersion: [this.obj.idVersion, Validators.required],
        idFormat: [this.obj.idFormat, Validators.required],
        dateCreated: [this.obj.dateCreated, Validators.required],
        codVersion: [this.obj.codVersion, [Validators.required, Validators.maxLength(100)]],
        stateVersion: [this.obj.stateVersion, Validators.required],
        version: [this.obj.version, Validators.required]
      });
    } else */
    this.form = this.fb.group({
      idFormat: [parseInt(this.data.idFormat), Validators.required],
      dateCreated: ["", Validators.required],
      codVersion: ["", [Validators.required, Validators.maxLength(100)]],
      stateVersion: ["", Validators.required],
      version: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  saveVersion() {
    this.obj = new ActVersion(this.form.value);
    this.loading = true;
    if (this.edit) {
      this.service
        .edit(this.obj)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          () => this.addOk(),
          (err) => snackError(this.snackbar, err)
        );
    } else
      this.service
        .add(this.obj)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          () => this.addOk(),
          (err) => snackError(this.snackbar, err)
        );
  }

  addOk() {
    if (this.edit) snackOk(this.snackbar, "Versión editada");
    else snackOk(this.snackbar, "Versión registrada");
    this.router.navigate([`home/versions/id_format/${this.data.idFormat}`], {
      relativeTo: this.route,
    });
    this.dialogRef.close();
  }
}
