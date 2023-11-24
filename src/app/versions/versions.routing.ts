import { Routes } from '@angular/router';
import { AccessServiceGuard } from '../core/services/access-service.guard';
import { VersionsComponent } from './versions.component';
import { ListVersionsComponent } from './list-versions/list-versions.component';
import { ListVersionsFillComponent } from './list-versions-fill/list-versions-fill.component';

export const versionRoutes: Routes = [
  {
    path: 'versions', component: VersionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: 'id_format/:id_format', component: ListVersionsComponent },
      { path: 'id_cf/:id_cf', component: ListVersionsFillComponent }
    ]
  }

];
