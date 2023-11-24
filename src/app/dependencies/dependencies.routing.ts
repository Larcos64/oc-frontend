import { Routes } from '@angular/router';
import { ListDependenciesComponent } from './list-dependencies/list-dependencies.component';
import { DependenciesComponent } from './dependencies.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const dependenciesRoutes: Routes = [
  {
    path: 'dependencies', component: DependenciesComponent, canActivate: [AccessServiceGuard], children: [
      { path: 'id_ques/:id_ques', component: ListDependenciesComponent },
      { path: 'id_sec/:id_sec', component: ListDependenciesComponent }
    ]
  }

];
