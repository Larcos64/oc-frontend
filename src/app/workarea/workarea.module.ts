import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkplacesComponent } from './workarea.component';
import { ListWorkplacesComponent } from './list-workarea/list-workarea.component';
import { AddWorkplaceDialogComponent } from './add-workarea-dialog/add-workarea-dialog.component';
import { EditWorkplaceDialogComponent } from './edit-workarea-dialog/edit-workarea-dialog.component';
import { DelWorkplaceDialogComponent } from './del-workarea-dialog/del-workarea-dialog.component';
import { WorkplacesService } from './services/workplaces.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddWorkplaceDialogComponent, EditWorkplaceDialogComponent, DelWorkplaceDialogComponent],
  declarations: [WorkplacesComponent, ListWorkplacesComponent, AddWorkplaceDialogComponent, EditWorkplaceDialogComponent, DelWorkplaceDialogComponent],
  providers: [WorkplacesService]
})
export class WorkplacesModule { }
