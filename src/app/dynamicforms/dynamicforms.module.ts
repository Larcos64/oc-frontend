import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DynamicformsComponent } from './dynamicforms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { SectionFormComponent } from './components/section-form/section-form.component';
import { InputComponent } from './components/input/input.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { SelectComponent } from './components/select/select.component';
import { FileinputComponent } from './components/fileinput/fileinput.component';
import { DateComponent } from './components/date/date.component';
import { ButtonComponent } from './components/button/button.component';
import { DynamicformsService } from './services/dynamicforms.service';
import { QuestionsFormComponent } from './components/questions-form/questions-form.component';
import { ColaboratorComponent } from './components/colaborator/colaborator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    InputComponent,
    TextareaComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    SelectComponent,
    FileinputComponent,
    DateComponent,
    ButtonComponent,
    ColaboratorComponent],
  declarations: [
    DynamicformsComponent,
    InputComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    SectionFormComponent,
    QuestionsFormComponent,
    ButtonComponent,
    SelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    TextareaComponent,
    FileinputComponent,
    ColaboratorComponent,
  ],
  providers: [DynamicformsService]
})
export class DynamicformsModule { }
