import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActFormat } from "../../shared/models/actformat.model";
import { PermitsService } from "../../core/services/permits.service";
import { FormatsService } from "../services/formats.service";
import { AddFormatDialogComponent } from "../add-format-dialog/add-format-dialog.component";
import { EditFormatDialogComponent } from "../edit-format-dialog/edit-format-dialog.component";
import { DelFormatDialogComponent } from "../del-format-dialog/del-format-dialog.component";
import { EditCompaniesDialogComponent } from "../edit-companies-dialog/edit-companies-dialog.component";
import { EditSectionsDialogComponent } from "../edit-sections-dialog/edit-sections-dialog.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-formats",
  templateUrl: "./list-formats.component.html",
  styleUrls: ["./list-formats.component.scss"],
})
export class ListFormatsComponent implements OnInit {
  data = new Array();
  breadcrumb = new Array();
  columnsFormat: string[] = ["cod", "name", "type", "issue", "actions"];
  dataSource: MatTableDataSource<ActFormat>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddFormatDialogComponent>;
  editDialogRef: MatDialogRef<EditFormatDialogComponent>;
  delDialogRef: MatDialogRef<DelFormatDialogComponent>;
  editCompDialogRef: MatDialogRef<EditCompaniesDialogComponent>;
  editSecDialogRef: MatDialogRef<EditSectionsDialogComponent>;
  index: number;

  permAssignSections = this.servicePermits.validatePermit(
    "Formatos.asignarSecciones"
  );
  permAssignToCompanies = this.servicePermits.validatePermit(
    "Formatos.asignarEmpresas"
  );
  permFormatVersions = this.servicePermits.validatePermit("Formatos.versiones");
  permCreate = this.servicePermits.validatePermit("Formatos.crear");
  permEdit = this.servicePermits.validatePermit("Formatos.editar");
  permDel = this.servicePermits.validatePermit("Formatos.eliminar");

  constructor(
    private router: Router,
    private service: FormatsService,
    public dialog: MatDialog,
    public servicePermits: PermitsService
  ) {}

  ngOnInit() {
    this.getFormats();
    this.breadcrumb.push(
      { url: "/home/homePage", name: "Inicio" },
      { url: "", name: "Encuesta" }
    );
  }

  getFormats() {
    this.service.list().subscribe((formats) => {
      this.data = formats;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getFormats();
  }

  startAdd(): void {
    this.addDialogRef = this.dialog.open(AddFormatDialogComponent, {
      width: "400px",
      height: "auto",
      closeOnNavigation: true,
      autoFocus: false,
    });

    this.addDialogRef.afterClosed().subscribe((result) => {
      this.getFormats();
    });
  }

  startEdit(
    i: number,
    idFormat: number,
    idUser: number,
    nameFormat: string,
    descFormat: string,
    typeFormat: string,
    codFormat: string,
    issueDate
  ) {
    this.index = i;
    this.editDialogRef = this.dialog.open(EditFormatDialogComponent, {
      width: "400px",
      height: "auto",
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        idFormat,
        idUser,
        nameFormat,
        descFormat,
        typeFormat,
        codFormat,
        issueDate,
      },
    });

    this.editDialogRef.afterClosed().subscribe((result) => {
      this.getFormats();
    });
  }

  startEditComp(i: number, idFormat: number, nameFormat: string) {
    this.index = i;
    this.editCompDialogRef = this.dialog.open(EditCompaniesDialogComponent, {
      width: "350px",
      height: "auto",
      closeOnNavigation: true,
      autoFocus: false,
      data: { idFormat, nameFormat },
    });

    this.editCompDialogRef.afterClosed().subscribe((result) => {
      this.getFormats();
    });
  }

  startEditSec(i: number, idFormat: number, nameFormat: string) {
    this.index = i;
    this.editSecDialogRef = this.dialog.open(EditSectionsDialogComponent, {
      width: "950px",
      height: "auto",
      closeOnNavigation: true,
      autoFocus: false,
      data: { idFormat, nameFormat },
    });

    this.editSecDialogRef.afterClosed().subscribe((result) => {
      this.getFormats();
    });
  }

  startDelete(
    i: number,
    idFormat: number,
    nameFormat: string,
    descFormat: string,
    codFormat: string
  ) {
    this.index = i;
    this.delDialogRef = this.dialog.open(DelFormatDialogComponent, {
      width: "400px",
      height: "auto",
      closeOnNavigation: true,
      data: { idFormat, nameFormat, descFormat, codFormat },
    });

    this.delDialogRef.afterClosed().subscribe((result) => {
      this.getFormats();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  goToVersions(element: ActFormat) {
    this.router.navigate(["home/versions/id_format", element.idFormat]);
  }
}
