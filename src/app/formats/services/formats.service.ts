import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActFormat } from '../../shared/models/actformat.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class FormatsService {

  constructor(private http: HttpClient) { }

  list(): Observable<ActFormat[]> {
    const url = `${environment.urlBase}/survey/`;
    return this.http.get<Rspn<ActFormat[]>>(url)
      .pipe(
        map(x => validate<ActFormat[]>(x)
        ));
  }

  formById(idForm: number): Observable<ActFormat[]> {
    const url = `${environment.urlBase}/survey/id_form/${idForm}`;
    return this.http.get<Rspn<ActFormat[]>>(url)
      .pipe(
        map(x => validate<ActFormat[]>(x)
        ));
  }

  formByIdRf(idForm: number): Observable<ActFormat[]> {
    const url = `${environment.urlBase}/survey/id_form_rf/${idForm}`;
    return this.http.get<Rspn<ActFormat[]>>(url)
      .pipe(
        map(x => validate<ActFormat[]>(x)
        ));
  }

  add(item: ActFormat): Observable<string> {
    const url = `${environment.urlBase}/survey/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActFormat): Observable<string> {
    const url = `${environment.urlBase}/survey/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/survey/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

}
