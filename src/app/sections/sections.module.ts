import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionsComponent } from './sections.component';
import { ListSectionsComponent } from './list-sections/list-sections.component';
import { AddSectionDialogComponent } from './add-section-dialog/add-section-dialog.component';
import { EditSectionDialogComponent } from './edit-section-dialog/edit-section-dialog.component';
import { DelSectionDialogComponent } from './del-section-dialog/del-section-dialog.component';
import { SectionsService } from './services/sections.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddSectionDialogComponent, EditSectionDialogComponent, DelSectionDialogComponent],
  declarations: [SectionsComponent, ListSectionsComponent, AddSectionDialogComponent, EditSectionDialogComponent, DelSectionDialogComponent],
  providers: [SectionsService]
})
export class SectionsModule { }
