import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompformatService } from './services/compformat.service';
import { CompformatComponent } from './compformat.component';
import { ListCompformatComponent } from './list-compformat/list-compformat.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CompformatComponent, ListCompformatComponent],
  providers: [CompformatService]
})
export class CompformatModule { }
