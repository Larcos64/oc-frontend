import { Routes } from '@angular/router';
import { DynamicformsComponent } from './dynamicforms.component';

export const dynamicformsRoutes: Routes = [
  {
    // path: 'dynamicformat', component: DynamicformsComponent, canActivate: [AccessServiceGuard], children: [
      path: 'fillformat/:id_cf/:id_ver', component: DynamicformsComponent
    // ]
  }

];
