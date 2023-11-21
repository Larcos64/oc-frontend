import { Routes } from '@angular/router';
import { ListFormatsComponent } from './list-formats/list-formats.component';
import { FormatsComponent } from './formats.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const formatsRoutes: Routes = [
  {
    path: 'formats', component: FormatsComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListFormatsComponent },
      // { path: 'id_comp/:id_comp', component: ListFormatsComponent }
    ]
  }

];
