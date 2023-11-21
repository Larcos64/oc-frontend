import { Routes } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { CompaniesComponent } from './companies.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';
// import { HomePageComponent } from '../core/pages/home-page/home-page.component';

export const companiesRoutes: Routes = [
  {
    path: 'companies', component: CompaniesComponent, canActivate: [AccessServiceGuard], children: [
      // { path: 'homePage', component: HomePageComponent },
      { path: '', component: ListCompaniesComponent }
    ]
  }
];
