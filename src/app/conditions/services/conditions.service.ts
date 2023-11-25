import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActCondition } from '../../shared/models/actcondition.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  constructor(private http: HttpClient) { }

  listByIdQues(idQues): Observable<ActCondition[]> {
    const url = `${environment.urlBase}/condition/id_ques/${idQues}`;
    return this.http.get<Rspn<ActCondition[]>>(url)
      .pipe(
        map(x => validate<ActCondition[]>(x)
        ));
  }

  add(item: ActCondition): Observable<string> {
    const url = `${environment.urlBase}/condition/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActCondition): Observable<string> {
    const url = `${environment.urlBase}/condition/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/condition/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
