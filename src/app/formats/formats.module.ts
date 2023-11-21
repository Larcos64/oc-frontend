import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatsComponent } from './formats.component';
import { ListFormatsComponent } from './list-formats/list-formats.component';
import { AddFormatDialogComponent } from './add-format-dialog/add-format-dialog.component';
import { EditFormatDialogComponent } from './edit-format-dialog/edit-format-dialog.component';
import { DelFormatDialogComponent } from './del-format-dialog/del-format-dialog.component';
import { FormatsService } from './services/formats.service';
import { EditCompaniesDialogComponent } from './edit-companies-dialog/edit-companies-dialog.component';
import { EditSectionsDialogComponent } from './edit-sections-dialog/edit-sections-dialog.component';
import { AddFsDialogComponent } from './add-fs-dialog/add-fs-dialog.component';
import { EditFsDialogComponent } from './edit-fs-dialog/edit-fs-dialog.component';
import { DelFsDialogComponent } from './del-fs-dialog/del-fs-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddFormatDialogComponent, EditFormatDialogComponent, DelFormatDialogComponent, EditCompaniesDialogComponent, EditSectionsDialogComponent, AddFsDialogComponent, EditFsDialogComponent, DelFsDialogComponent],
  declarations: [FormatsComponent, ListFormatsComponent, AddFormatDialogComponent, EditFormatDialogComponent, DelFormatDialogComponent, EditCompaniesDialogComponent, EditSectionsDialogComponent, AddFsDialogComponent, EditFsDialogComponent, DelFsDialogComponent],
  providers: [FormatsService]
})
export class FormatsModule { }
