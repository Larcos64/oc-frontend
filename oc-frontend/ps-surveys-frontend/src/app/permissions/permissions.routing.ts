import { Routes } from '@angular/router';
import { ListPermissionsComponent } from './list-permissions/list-permissions.component';
import { PermissionsComponent } from './permissions.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const permissionsRoutes: Routes = [
  {
    path: 'permissions', component: PermissionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListPermissionsComponent }
    ]
  }
];
