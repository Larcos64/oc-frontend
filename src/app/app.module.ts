import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "./core/core.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { UsersModule } from "./users/users.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { CompaniesModule } from "./companies/companies.module";
import { PermisrolModule } from "./permisrol/permisrol.module";
import { WorkplacesModule } from "./workarea/workarea.module";
import { VocabularyService } from "../services/vocabulary.service";
// material
import { MatModule } from "./shared/mat.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormatsModule } from "./formats/formats.module";
import { SectionsModule } from "./sections/sections.module";
import { CompformatModule } from './compformat/compformat.module';
import { OptionsModule } from './options/options.module';
import { QuestionsModule } from './questions/questions.module';
import { DependenciesModule } from './dependencies/dependencies.module';

import { DynamicformsModule } from './dynamicforms/dynamicforms.module';
import { VersionsModule } from './versions/versions.module';
import { RegformatsModule } from './regformats/regformats.module';
import { ConditionsModule } from "./conditions/conditions.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    FlexLayoutModule,
    UsersModule,
    FormatsModule,
    QuestionsModule,
    SectionsModule,
    CompformatModule,
    VersionsModule,
    RegformatsModule,
    OptionsModule,
    DependenciesModule,
    DynamicformsModule,
    ProfilesModule,
    PermissionsModule,
    PermisrolModule,
    CompaniesModule,
    WorkplacesModule,
    MatModule,
    FormsModule,
    ReactiveFormsModule,
    ConditionsModule,
  ],
  providers: [VocabularyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
