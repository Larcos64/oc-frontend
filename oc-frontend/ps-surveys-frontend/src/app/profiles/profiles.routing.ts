import { Routes } from '@angular/router';
import { ListProfilesComponent } from './list-profiles/list-profiles.component';
import { ProfilesComponent } from './profiles.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const profilesRoutes: Routes = [
  {
    path: 'profiles', component: ProfilesComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListProfilesComponent }
    ]
  }
];
