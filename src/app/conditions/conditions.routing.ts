import { Routes } from '@angular/router';
import { ConditionsComponent } from './conditions.component';
import { ListConditionsComponent } from './list-conditions/list-conditions.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const conditionsRoutes: Routes = [
  {
    path: 'conditions', component: ConditionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: 'id_ques/:id_ques', component: ListConditionsComponent }
    ]
  }

];
