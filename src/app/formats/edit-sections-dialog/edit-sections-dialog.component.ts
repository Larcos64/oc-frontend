import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsectionService } from '../../formsection/services/formsection.service';
import { ActFormatSection } from '../../shared/models/actformatsection.model';
import { AddFsDialogComponent } from '../add-fs-dialog/add-fs-dialog.component';
import { EditFsDialogComponent } from '../edit-fs-dialog/edit-fs-dialog.component';
import { DelFsDialogComponent } from '../del-fs-dialog/del-fs-dialog.component';
import { PermitsService } from '../../core/services/permits.service';

@Component({
  selector: 'app-edit-sections-dialog',
  templateUrl: './edit-sections-dialog.component.html',
  styleUrls: ['./edit-sections-dialog.component.scss']
})
export class EditSectionsDialogComponent implements OnInit {

  dataFs = new Array();
  columnsFs: string[] = ['name', 'type', 'state', 'order', 'actions'];
  dataSource: MatTableDataSource<ActFormatSection>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  index: number;
  nameFormat = this.data.nameFormat;

  addFsDialogRef: MatDialogRef<AddFsDialogComponent>;
  editFsDialogRef: MatDialogRef<EditFsDialogComponent>;
  delFsDialogRef: MatDialogRef<DelFsDialogComponent>;

  constructor(private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<EditSectionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: FormsectionService, public servicePermits: PermitsService) { }

  ngOnInit() {
    this.getFormSections();
  }

  getFormSections() {
    this.service.listByIdForm(this.data.idFormat).subscribe(sections => {
      this.dataFs = sections;
      this.dataSource = new MatTableDataSource(this.dataFs);
      console.log("this.dataSource: ", this.dataSource);      
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.getFormSections();
  }

  startAdd(idFormat: number): void {
    this.addFsDialogRef = this.dialog.open(AddFsDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { idFormat }
    });

    this.addFsDialogRef.afterClosed().subscribe(result => {
      this.getFormSections();
    });
  }

  startEdit(i: number, id_fs: number, id_sec: number, id_format: number, state_ss: string, order_ss: number, name_sec: string) {
    this.index = i;
    this.editFsDialogRef = this.dialog.open(EditFsDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: { id_fs, id_sec, id_format, state_ss, order_ss, name_sec }
    });

    this.editFsDialogRef.afterClosed().subscribe(result => {
      this.getFormSections();
    });
  }

  startDelete(i: number, id_fs: number, id_sec: number, id_format: number, name_sec: string, desc_sec: string) {
    this.index = i;
    var name_format = this.nameFormat;
    this.delFsDialogRef = this.dialog.open(DelFsDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { id_fs, id_sec, id_format, name_sec, desc_sec, name_format }
    });

    this.delFsDialogRef.afterClosed().subscribe(result => {
      this.getFormSections();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
