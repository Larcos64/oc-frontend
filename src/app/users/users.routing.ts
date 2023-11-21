import { Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { UsersComponent } from './users.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const usersRoutes: Routes = [
  {
    path: 'users', component: UsersComponent, canActivate: [AccessServiceGuard], children: [
      //{ path: '', component: ListUsersComponent },
      { path: 'id_comp/:id_comp', component: ListUsersComponent }
    ]
  }

];
