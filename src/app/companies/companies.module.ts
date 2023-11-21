import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniesComponent } from './companies.component';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import { EditCompanyDialogComponent } from './edit-company-dialog/edit-company-dialog.component';
import { DelCompanyDialogComponent } from './del-company-dialog/del-company-dialog.component';
import { CompaniesService } from './services/companies.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddCompanyDialogComponent, EditCompanyDialogComponent, DelCompanyDialogComponent],
  declarations: [CompaniesComponent, AddCompanyDialogComponent, EditCompanyDialogComponent, DelCompanyDialogComponent, ListCompaniesComponent],
  providers: [CompaniesService]
})
export class CompaniesModule { }
