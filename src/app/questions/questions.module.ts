import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions.component';
import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionsService } from './services/questions.service';
import { AddOptionDialogComponent } from './add-option-dialog/add-option-dialog.component';

import { AddQuestionDialogComponent } from './add-question-dialog/add-question-dialog.component';
import { EditQuestionDialogComponent } from './edit-question-dialog/edit-question-dialog.component';
import { DelQuestionDialogComponent } from './del-question-dialog/del-question-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AddOptionDialogComponent, AddQuestionDialogComponent, EditQuestionDialogComponent, DelQuestionDialogComponent],
  declarations: [QuestionsComponent, AddQuestionComponent, ListQuestionsComponent, AddOptionDialogComponent, AddQuestionDialogComponent, EditQuestionDialogComponent, DelQuestionDialogComponent],
  providers: [QuestionsService]
})
export class QuestionsModule { }
