import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegformatsComponent } from './regformats.component';
import { RegformatsService } from './services/regformats.service';
import { ListRegformatsComponent } from './list-regformats/list-regformats.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';

@NgModule({
  declarations: [RegformatsComponent, ListRegformatsComponent, ReportDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [RegformatsService]
})
export class RegformatsModule { }
