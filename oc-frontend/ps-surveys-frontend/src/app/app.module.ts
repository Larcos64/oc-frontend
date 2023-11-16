import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from '@angular/common/http';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermisrolModule } from './permisrol/permisrol.module';
import { WorkplacesModule } from './workplaces/workplaces.module';
import { VocabularyService } from '../services/vocabulary.service';
// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';
// material
import { MatModule } from './shared/mat.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    FlexLayoutModule,
    UsersModule,
    ProfilesModule,
    PermissionsModule,
    PermisrolModule,
    WorkplacesModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [VocabularyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
