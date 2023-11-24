import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActFormat } from '../../shared/models/actformat.model';
import { PermitsService } from '../../core/services/permits.service';
import { VersionsService } from '../services/versions.service';
import { ActVersion } from 'src/app/shared/models/actversion.model';
import { ActivatedRoute } from '@angular/router';
import { AddVersionDialogComponent } from '../add-version-dialog/add-version-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialogconfirm/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
import { snackOk, snackError } from 'src/app/util/snackbar-util';
import { MatSnackBar } from '@angular/material';
import { VersionSectionsDialogComponent } from '../version-sections-dialog/version-sections-dialog.component';
import { VersionQuesDialogComponent } from '../version-ques-dialog/version-ques-dialog.component';
import { FormatsService } from '../../formats/services/formats.service';
/*import { AddFormatDialogComponent } from '../add-format-dialog/add-format-dialog.component';
import { EditFormatDialogComponent } from '../edit-format-dialog/edit-format-dialog.component';
import { DelFormatDialogComponent } from '../del-format-dialog/del-format-dialog.component';
import { EditCompaniesDialogComponent } from '../edit-companies-dialog/edit-companies-dialog.component';
import { EditSectionsDialogComponent } from '../edit-sections-dialog/edit-sections-dialog.component';
*/
@Component({
  selector: 'app-list-versions',
  templateUrl: './list-versions.component.html',
  styleUrls: ['./list-versions.component.scss']
})
export class ListVersionsComponent implements OnInit {

  data = new Array();
  dataForm = new Array();
  breadcrumb = new Array();
  columnsFormat: string[] = ['codVersion', 'version', 'dateCreated', 'stateVersion', 'actions'];
  dataSource: MatTableDataSource<ActVersion>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addDialogRef: MatDialogRef<AddVersionDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  versionSectionDialog: MatDialogRef<VersionSectionsDialogComponent>;
  versionQuestionDialog: MatDialogRef<VersionQuesDialogComponent>;
  /*
   editCompDialogRef: MatDialogRef<EditCompaniesDialogComponent>;
   editSecDialogRef: MatDialogRef<EditSectionsDialogComponent>;*/
  index: number;

  permAssignSections = this.servicePermits.validatePermit('Formatos.versiones.asignarSecciones');
  permAssignQuestions = this.servicePermits.validatePermit('Formatos.versiones.asignarPreguntas');
  permCreate = this.servicePermits.validatePermit('Formatos.versiones.crear');
  permEdit = this.servicePermits.validatePermit('Formatos.versiones.editar');
  permDel = this.servicePermits.validatePermit('Formatos.versiones.eliminar');

  idFormat: number;
  nameFormat: number;

  constructor(private service: VersionsService, public dialog: MatDialog, public servicePermits: PermitsService,
    private activateRoute: ActivatedRoute, private snackbar: MatSnackBar, public serviceForm: FormatsService) { }

  ngOnInit() { // pedir explicación de luis
    this.activateRoute.params.subscribe(params => {
      this.idFormat = params["id_format"];
      this.getFormat();
      this.list();
    });
    /* if (this.permAdmin) {
      this.breadcrumb.push(
        { url: '../../../home/', name: 'Inicio' },
        { url: '', name: 'Versiones' },
      );
    } else {
      this.breadcrumb.push(
        { url: '../../../home/versions', name: 'Inicio' },
        { url: '', name: 'Versiones' },
      );
    } */
  }

  list() {
    this.service.list(this.idFormat).subscribe(list => {
      this.data = list;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh() {
    this.list();
  }

  getFormat() {
    this.serviceForm.formById(this.idFormat).subscribe(format => {
      this.dataForm = format;
      this.nameFormat = this.dataForm['nameFormat'];

        this.breadcrumb.push(
          { url: '/home/homePage', name: 'Inicio' },
          { url: '../../../../home/formats', name: 'Formatos' },
          { url: '', name: `Versiones ${this.nameFormat}` },
        );
    });
  }

  startAdd(): void {
    this.showDialog(null)
  }

  startEdit(i: number, element: any) {
    this.index = i;
    var objEdit: ActVersion = {
      idFormat: element.id_format,
      idVersion: element.id_version,
      dateCreated: new Date(element.date_created),
      codVersion: element.cod_version,
      stateVersion: element.state_ver,
      version: element.version
    }
    this.showDialog(objEdit)
  }

  showDialog(objEdit: ActVersion) {
    this.addDialogRef = this.dialog.open(AddVersionDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        idFormat: this.idFormat, objEdit: objEdit
      }
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      this.list();
    });
  }

  startDelete(i: number, element: any) {
    this.index = i;
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      data: { message: `¿Esta seguro de eliminar la versión con código: ${element.cod_version}?` }
    });

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(element.id_version)
          .subscribe(() => {
            snackOk(this.snackbar, 'Versión eliminada')
            this.list()
          },
            () => snackError(this.snackbar, 'Error al eliminar versión'));
        this.list();
      }
    });
  }


  startEditSec(i: number, element: any) {
    this.index = i;
    this.versionSectionDialog = this.dialog.open(VersionSectionsDialogComponent, {
      width: '80%',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        version: {
          idVersion: element.id_version,
          idFormat: element.id_format,
          codVersion: element.cod_version,
          version: element.version
        }
      }
    });

    this.versionSectionDialog.afterClosed().subscribe(result => {
      // this.list();
    });
  }


  startEditQues(i: number, element: any) {
    this.index = i;
    this.versionQuestionDialog = this.dialog.open(VersionQuesDialogComponent, {
      width: '80%',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        version: {
          idVersion: element.id_version,
          codVersion: element.cod_version,
          version: element.version
        }
      }
    });

    this.versionQuestionDialog.afterClosed().subscribe(result => {
      // this.list();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
