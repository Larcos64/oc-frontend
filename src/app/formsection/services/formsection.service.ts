import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActFormatSection } from '../../shared/models/actformatsection.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class FormsectionService {

  constructor(private http: HttpClient) { }

  add(item: ActFormatSection): Observable<string> {
    const url = `${environment.urlBase}/formsection/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActFormatSection): Observable<string> {
    const url = `${environment.urlBase}/formsection/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/formsection/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

  listByIdForm(idFormat: number): Observable<any[]> {
    const url = `${environment.urlBase}/formsection/id_form/${idFormat}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  listByIdFormFill(idFormat: number, idVersion: number): Observable<any[]> {
    const url = `${environment.urlBase}/formsection/id_form_f/${idFormat}/id_version/${idVersion}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }
}
