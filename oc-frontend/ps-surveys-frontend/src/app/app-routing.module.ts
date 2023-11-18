import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { HomeComponent } from './core/pages/home/home.component';
import { usersRoutes } from './users/users.routing';
import { profilesRoutes } from './profiles/profiles.routing';
import { permissionsRoutes } from './permissions/permissions.routing';
import { workplacesRoutes } from './workplaces/workplaces.routing';
import { HomePageComponent } from './core/pages/home-page/home-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      ...usersRoutes,
      ...profilesRoutes,
      ...permissionsRoutes,
      ...workplacesRoutes,
      { path: 'homePage', component: HomePageComponent },
      { path: '', redirectTo: 'companies', pathMatch: 'full' }
    ]
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
