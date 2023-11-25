import { Routes } from '@angular/router';
import { RegformatsComponent } from './regformats.component';
import { ListRegformatsComponent } from './list-regformats/list-regformats.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const regformatsRoutes: Routes = [
  {
    path: 'regformats', component: RegformatsComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListRegformatsComponent },
      { path: ':id_rf/:id_form/:id_ver/:id_comp', component: ReportDetailComponent }
    ]
  }

];
