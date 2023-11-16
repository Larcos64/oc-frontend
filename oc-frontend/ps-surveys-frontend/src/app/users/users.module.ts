import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { DelUserDialogComponent } from './del-user-dialog/del-user-dialog.component';
import { UsersService } from './services/users.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddUserDialogComponent, EditUserDialogComponent, DelUserDialogComponent],
  declarations: [UsersComponent, ListUsersComponent, AddUserDialogComponent, EditUserDialogComponent, DelUserDialogComponent],
  providers: [UsersService]
})
export class UsersModule { }
