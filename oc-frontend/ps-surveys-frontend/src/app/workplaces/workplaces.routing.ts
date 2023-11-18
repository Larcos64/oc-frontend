import { Routes } from '@angular/router';
import { ListWorkplacesComponent } from './list-workplaces/list-workplaces.component';
import { WorkplacesComponent } from './workplaces.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const workplacesRoutes: Routes = [
  {
    path: 'workplaces', component: WorkplacesComponent, canActivate: [AccessServiceGuard], children: [
      //{ path: '', component: ListUsersComponent },
      { path: 'id_comp/:id_comp', component: ListWorkplacesComponent }
    ]
  }

];
