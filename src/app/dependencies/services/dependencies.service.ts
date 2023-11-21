import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActDependency } from '../../shared/models/actdependency.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class DependenciesService {

  constructor(private http: HttpClient) { }

  listByIdQues(idQues: number): Observable<any[]> {
    const url = `${environment.urlBase}/dependency/id_ques/${idQues}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  listByIdSec(idSec: number): Observable<any[]> {
    const url = `${environment.urlBase}/dependency/id_sec/${idSec}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  add(item: ActDependency): Observable<string> {
    const url = `${environment.urlBase}/dependency/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActDependency): Observable<string> {
    const url = `${environment.urlBase}/dependency/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/dependency/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }


  loadQuestionDependency(idQues: number, type: number): Observable<any[]> {
    const url = `${environment.urlBase}/dependency/id_ques_or_sec/${idQues}/type/${type}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

}
