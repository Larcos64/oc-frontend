import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { ActVersion } from 'src/app/shared/models/actversion.model';
import { ActVersionSection } from 'src/app/shared/models/actversionsection.model';
import { ActVersionQues } from 'src/app/shared/models/actversionques.model';
import { ActQues } from 'src/app/shared/models/actquestion.model';

@Injectable({
  providedIn: 'root'
})
export class VersionsQuesService {

  constructor(private http: HttpClient) { }

  listByIdVersion(idVersion: number): Observable<ActVersionQues[]> {
    const url = `${environment.urlBase}/verques/id_ver/${idVersion}`;
    return this.http.get<Rspn<ActVersionQues[]>>(url)
      .pipe(map(x => validate<ActVersionQues[]>(x)));
  }

  listByIdVersionInfoSection(idVersion: number): Observable<ActVersionSection[]> {
    const url = `${environment.urlBase}/verques/infoQuestion/id_ver/${idVersion}`;
    return this.http.get<Rspn<ActVersionSection[]>>(url)
      .pipe(map(x => validate<ActVersionSection[]>(x)));
  }

  listQuesNoVersion(idVersion: number, idSec: number): Observable<ActQues[]> {
    const url = `${environment.urlBase}/verques/questionNoVersion/id_ver/${idVersion}/id_sec/${idSec}`;
    return this.http.get<Rspn<ActQues[]>>(url)
      .pipe(map(x => validate<ActQues[]>(x)));
  }

  addQuestions(item: ActVersionQues[], idVersion: number): Observable<string> {
    const url = `${environment.urlBase}/verques/insertQuestions/id_ver/${idVersion}`;
    return this.http.post<Rspn<string>>(url, item)
      .pipe(map(x => validate(x)));
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/verques/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

}
