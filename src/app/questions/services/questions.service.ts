import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActQues } from '../../shared/models/actquestion.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  listByIdSec(idSec): Observable<ActQues[]> {
    const url = `${environment.urlBase}/question/id_sec/${idSec}`;
    return this.http.get<Rspn<ActQues[]>>(url)
      .pipe(
        map(x => validate<ActQues[]>(x)
        ));
  }

  listByIdSecFill(idSec: number, idVersion: number): Observable<ActQues[]> {
    const url = `${environment.urlBase}/question/id_sec/${idSec}/id_sv/${idVersion}`;
    return this.http.get<Rspn<ActQues[]>>(url)
      .pipe(
        map(x => validate<ActQues[]>(x)
        ));
  }

  listByIdSecNotIn(idSec): Observable<ActQues[]> {
    const url = `${environment.urlBase}/question/id_sec_ni/${idSec}`;
    return this.http.get<Rspn<ActQues[]>>(url)
      .pipe(
        map(x => validate<ActQues[]>(x)
        ));
  }

  quesById(idQues: number): Observable<any[]> {
    const url = `${environment.urlBase}/question/id_ques/${idQues}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  add(item: ActQues): Observable<string> {
    const url = `${environment.urlBase}/question/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActQues): Observable<string> {
    const url = `${environment.urlBase}/question/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number, idSec: number): Observable<string> {
    const url = `${environment.urlBase}/question/${id}/id_sec/${idSec}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
