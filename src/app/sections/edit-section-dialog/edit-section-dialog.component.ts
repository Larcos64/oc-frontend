import { Component, OnInit, Inject } from "@angular/core";
import { finalize } from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SectionsService } from "../services/sections.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ActSection } from "../../shared/models/actsection.model";
import { snackError, snackOk } from "../../util/snackbar-util";
import { MatSnackBar } from "@angular/material";
import { sectionsRoutes } from "../sections.routing";

@Component({
  selector: "app-edit-section-dialog",
  templateUrl: "./edit-section-dialog.component.html",
  styleUrls: ["./edit-section-dialog.component.scss"],
})
export class EditSectionDialogComponent implements OnInit {
  form: FormGroup;
  section = new ActSection();
  loading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditSectionDialogComponent>,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: SectionsService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      idSection: [this.data.idSection, Validators.required],
      nameSection: [
        this.data.nameSection,
        [Validators.required, Validators.maxLength(200)],
      ],
      descSection: [this.data.descSection, Validators.maxLength(200)],
      typeSection: [this.data.typeSection, Validators.maxLength(10)],
      tableName: [
        this.data.tableName,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  editSection() {
    this.section = new ActSection(this.form.value);
    this.loading = true;
    this.service
      .edit(this.section)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this.editOk(),
        () => snackError(this.snackbar, "Error al editar sección")
      );
  }

  editOk() {
    snackOk(this.snackbar, "Sección actualizada");
    this.router.navigate(["home/sections"], { relativeTo: this.route });
    this.dialogRef.close();
  }
}
