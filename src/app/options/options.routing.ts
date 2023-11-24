import { Routes } from '@angular/router';
import { ListOptionsComponent } from './list-options/list-options.component';
import { OptionsComponent } from './options.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const optionsRoutes: Routes = [
  {
    path: 'options', component: OptionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListOptionsComponent }
    ]
  }
];
