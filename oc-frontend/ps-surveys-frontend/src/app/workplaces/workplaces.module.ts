import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkplacesComponent } from './workplaces.component';
import { ListWorkplacesComponent } from './list-workplaces/list-workplaces.component';
import { AddWorkplaceDialogComponent } from './add-workplace-dialog/add-workplace-dialog.component';
import { EditWorkplaceDialogComponent } from './edit-workplace-dialog/edit-workplace-dialog.component';
import { DelWorkplaceDialogComponent } from './del-workplace-dialog/del-workplace-dialog.component';
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
