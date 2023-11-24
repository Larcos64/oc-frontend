import { Routes } from '@angular/router';
import { ListWorkplacesComponent } from './list-workarea/list-workarea.component';
import { WorkplacesComponent } from './workarea.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const workplacesRoutes: Routes = [
  {
    path: 'workarea', component: WorkplacesComponent, canActivate: [AccessServiceGuard], children: [
      //{ path: '', component: ListUsersComponent },
      { path: 'id_comp/:id_comp', component: ListWorkplacesComponent }
    ]
  }

];
