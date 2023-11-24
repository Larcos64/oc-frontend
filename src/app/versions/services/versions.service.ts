import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { ActVersion } from 'src/app/shared/models/actversion.model';

@Injectable({
  providedIn: 'root'
})
export class VersionsService {

  constructor(private http: HttpClient) { }

  list(idFormat: number): Observable<ActVersion[]> {
    const url =  `${environment.urlBase}/surveyversion/id_form/${idFormat}`;
    return this.http.get<Rspn<ActVersion[]>>(url)
      .pipe(
        map(x => validate<ActVersion[]>(x)
        ));
  }

  getById(id: number): Observable<ActVersion[]> {
    const url = `${environment.urlBase}/surveyversion/id_ver/${id}`;
    return this.http.get<Rspn<ActVersion[]>>(url)
      .pipe(
        map(x => validate<ActVersion[]>(x)
        ));
  }

  add(item: ActVersion): Observable<string> {
    const url = `${environment.urlBase}/surveyversion/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActVersion): Observable<string> {
    const url = `${environment.urlBase}/surveyversion/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/surveyversion/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

}
