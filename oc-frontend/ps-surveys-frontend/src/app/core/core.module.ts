import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { UserPanelComponent } from './pages/user-panel/user-panel.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UserInfoDialogComponent } from './pages/user-info-dialog/user-info-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [UserInfoDialogComponent],
  declarations: [LoginComponent, HomeComponent, UserPanelComponent, HomePageComponent, UserInfoDialogComponent]
})
export class CoreModule { }
