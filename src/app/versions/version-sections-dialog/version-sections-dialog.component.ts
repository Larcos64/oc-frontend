import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VersionSectionService } from '../services/versionssection.service';
import { finalize } from 'rxjs/operators';
import { snackError, snackOk } from 'src/app/util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { ActVersionSection } from 'src/app/shared/models/actversionsection.model';

@Component({
  selector: 'app-version-sections-dialog',
  templateUrl: './version-sections-dialog.component.html'
})
export class VersionSectionsDialogComponent implements OnInit {

  dataFs = new Array();
  columnsFs: string[] = ['name', 'desc', 'type', 'actions'];
  dataSource: MatTableDataSource<ActVersionSection>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  index: number;

  sections = new Array()
  sectionsAll = new Array()
  sectionSelects = new Array()

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<VersionSectionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: VersionSectionService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getVersionSections();
    this.getSectionsNoVersion()
  }


  getVersionSections() {
    this.service.listByIdVersionInfoSection(this.data.version.idVersion).subscribe(sections => {
      this.dataFs = sections;
      this.dataSource = new MatTableDataSource(this.dataFs);
      this.dataSource.paginator = this.paginator;
    });
  }
  getSectionsNoVersion() {
    this.service.listSectionsNoVersion(this.data.version.idVersion, this.data.version.idFormat)
      .subscribe(sections => {
        this.sections = sections
        this.sectionsAll = sections
      });
  }

  refresh() {
    this.getVersionSections();
    this.getSectionsNoVersion()
  }

  startDelete(i: number, element: any) {
    this.index = i;
    this.service.delete(element.id_ver_sec)
      .pipe(finalize(() => this.refresh()))
      .subscribe(() => snackOk(this.snackbar, 'Secciones eliminada correctamente'), (err) => snackError(this.snackbar, err));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilterSection(val) {
    this.sections = this.sectionsAll.filter((unit) => {
      return unit.nameSection.toLowerCase().indexOf(val.toLowerCase()) > -1
    });
  }

  addSections() {
    // this.loading = true;
    this.service.addSections(this.sectionSelects, this.data.version.idVersion)
      .pipe(
        finalize(() => this.refresh())
      )
      .subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }
  addOk() {
    snackOk(this.snackbar, 'Secciones registradas correctamente')
  }

}
