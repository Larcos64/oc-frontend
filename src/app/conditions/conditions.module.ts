import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConditionsComponent } from './conditions.component';
import { ListConditionsComponent } from './list-conditions/list-conditions.component';
import { AddConditionDialogComponent } from './add-condition-dialog/add-condition-dialog.component';
import { EditConditionDialogComponent } from './edit-condition-dialog/edit-condition-dialog.component';
import { DelConditionDialogComponent } from './del-condition-dialog/del-condition-dialog.component';
import { ConditionsService } from './services/conditions.service';
import { TranstringPipe } from "../../pipes/transtring.pipe";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddConditionDialogComponent, EditConditionDialogComponent, DelConditionDialogComponent],
  declarations: [ConditionsComponent, ListConditionsComponent, AddConditionDialogComponent, EditConditionDialogComponent, DelConditionDialogComponent, TranstringPipe],
  providers: [ConditionsService]
})
export class ConditionsModule { }
