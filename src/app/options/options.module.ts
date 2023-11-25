import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionsComponent } from './options.component';
import { OptionsService } from './services/options.service';
import { ListOptionsComponent } from './list-options/list-options.component';
import { AddOptionDialogComponent } from './add-option-dialog/add-option-dialog.component';
import { EditOptionDialogComponent } from './edit-option-dialog/edit-option-dialog.component';
import { DelOptionDialogComponent } from './del-option-dialog/del-option-dialog.component';
import { AddOptvalDialogComponent } from './add-optval-dialog/add-optval-dialog.component';
import { EditOptvalDialogComponent } from './edit-optval-dialog/edit-optval-dialog.component';
import { DelOptvalDialogComponent } from './del-optval-dialog/del-optval-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddOptionDialogComponent, EditOptionDialogComponent, DelOptionDialogComponent, AddOptvalDialogComponent, EditOptvalDialogComponent, DelOptvalDialogComponent],
  declarations: [OptionsComponent, ListOptionsComponent, AddOptionDialogComponent, EditOptionDialogComponent, DelOptionDialogComponent, AddOptvalDialogComponent, EditOptvalDialogComponent, DelOptvalDialogComponent],
  providers: [OptionsService]
})
export class OptionsModule { }
