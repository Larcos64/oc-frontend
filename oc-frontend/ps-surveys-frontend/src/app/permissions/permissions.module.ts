import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionsComponent } from './permissions.component';
import { ListPermissionsComponent } from './list-permissions/list-permissions.component';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';
import { EditPermissionDialogComponent } from './edit-permission-dialog/edit-permission-dialog.component';
import { DelPermissionDialogComponent } from './del-permission-dialog/del-permission-dialog.component';
import { PermissionsService } from './services/permissions.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddPermissionDialogComponent, EditPermissionDialogComponent, DelPermissionDialogComponent],
  declarations: [PermissionsComponent, ListPermissionsComponent, AddPermissionDialogComponent, EditPermissionDialogComponent, DelPermissionDialogComponent],
  providers: [PermissionsService]
})
export class PermissionsModule { }
