import { Routes } from '@angular/router';
import { ListSectionsComponent } from './list-sections/list-sections.component';
import { SectionsComponent } from './sections.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';

export const sectionsRoutes: Routes = [
  {
    path: 'sections', component: SectionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: '', component: ListSectionsComponent },
      // { path: 'id_comp/:id_comp', component: ListFormatsComponent }
    ]
  }

];
