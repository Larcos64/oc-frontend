import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilesComponent } from './profiles.component';
import { ListProfilesComponent } from './list-profiles/list-profiles.component';
import { AddProfileDialogComponent } from './add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { DelProfileDialogComponent } from './del-profile-dialog/del-profile-dialog.component';
import { ProfilesService } from './services/profiles.service';
import { EditPermissionsDialogComponent } from './edit-permissions-dialog/edit-permissions-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddProfileDialogComponent, EditProfileDialogComponent, DelProfileDialogComponent, EditPermissionsDialogComponent],
  declarations: [ProfilesComponent, ListProfilesComponent, AddProfileDialogComponent, EditProfileDialogComponent, DelProfileDialogComponent, EditPermissionsDialogComponent],
  providers: [ProfilesService]
})
export class ProfilesModule { }
