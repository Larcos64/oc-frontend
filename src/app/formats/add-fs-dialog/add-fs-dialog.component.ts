import { Component, OnInit, Inject } from "@angular/core";
import { finalize } from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormsectionService } from "../../formsection/services/formsection.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ActFormatSection } from "../../shared/models/actformatsection.model";
import { snackError, snackOk } from "../../util/snackbar-util";
import { MatSnackBar } from "@angular/material";
import { SectionsService } from "../../sections/services/sections.service";

@Component({
  selector: "app-add-fs-dialog",
  templateUrl: "./add-fs-dialog.component.html",
  styleUrls: ["./add-fs-dialog.component.scss"],
})
export class AddFsDialogComponent implements OnInit {
  form: FormGroup;
  sectionsNif = new Array();
  fs = new ActFormatSection();
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddFsDialogComponent>,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: FormsectionService,
    public serviceSec: SectionsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getSecNotInForm();
  }

  initForm() {
    this.form = this.fb.group({
      idFormat: [this.data.idFormat, Validators.required],
      idSec: ["", Validators.required],
      stateFs: ["", Validators.required],
      orderFs: ["", [Validators.required, Validators.max(9999)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  getSecNotInForm() {
    this.serviceSec.listNotInForm(this.data.idFormat).subscribe((sec) => {
      this.sectionsNif = sec;
    });
  }

  saveFs() {
    this.fs = new ActFormatSection(this.form.value);
    this.loading = true;
    this.service
      .add(this.fs)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this.addOk(),
        (err) => snackError(this.snackbar, err)
      );
  }

  addOk() {
    snackOk(this.snackbar, "Sección asignada");
    // this.router.navigate([`home/users/id_comp/${this.data["idComp"]}`], { relativeTo: this.route });
    this.dialogRef.close();
  }
}
