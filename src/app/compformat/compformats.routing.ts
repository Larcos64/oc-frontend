import { Routes } from '@angular/router';
import { ListCompformatComponent } from './list-compformat/list-compformat.component';
import { CompformatComponent } from './compformat.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const compformatsRoutes: Routes = [
  {
    path: 'compformat', component: CompformatComponent, canActivate: [AccessServiceGuard], children: [
      { path: 'id_comp/:id_comp', component: ListCompformatComponent }
    ]
  }
];
