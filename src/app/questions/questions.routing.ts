import { Routes } from '@angular/router';
import { QuestionsComponent } from './questions.component';
import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { AccessServiceGuard } from '../core/services/access-service.guard';
// import { AddQuestionComponent } from './add-question/add-question.component';

export const questionsRoutes: Routes = [
  {
    path: 'questions', component: QuestionsComponent, canActivate: [AccessServiceGuard], children: [
      { path: 'id_sec/:id_sec', component: ListQuestionsComponent }
    ]
  }

];
