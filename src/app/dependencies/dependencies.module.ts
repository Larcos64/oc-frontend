import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DependenciesComponent } from './dependencies.component';
import { ListDependenciesComponent } from './list-dependencies/list-dependencies.component';
import { AddDependencyDialogComponent } from './add-dependency-dialog/add-dependency-dialog.component';
import { EditDependencyDialogComponent } from './edit-dependency-dialog/edit-dependency-dialog.component';
import { DelDependencyDialogComponent } from './del-dependency-dialog/del-dependency-dialog.component';
import { DependenciesService } from './services/dependencies.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddDependencyDialogComponent, EditDependencyDialogComponent, DelDependencyDialogComponent],
  declarations: [DependenciesComponent, ListDependenciesComponent, AddDependencyDialogComponent, EditDependencyDialogComponent, DelDependencyDialogComponent],
  providers: [DependenciesService]
})
export class DependenciesModule { }
