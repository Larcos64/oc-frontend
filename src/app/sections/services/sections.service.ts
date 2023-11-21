import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActSection } from '../../shared/models/actsection.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor(private http: HttpClient) { }

  list(): Observable<ActSection[]> {
    const url = `${environment.urlBase}/section/`;
    return this.http.get<Rspn<ActSection[]>>(url)
      .pipe(
        map(x => validate<ActSection[]>(x)
        ));
  }

  listNotInForm(idForm: number): Observable<ActSection[]> {
    const url = `${environment.urlBase}/section/id_form/${idForm}`;
    return this.http.get<Rspn<ActSection[]>>(url)
      .pipe(
        map(x => validate<ActSection[]>(x)
        ));
  }

  secById(idSec: number): Observable<ActSection[]> {
    const url = `${environment.urlBase}/section/id_sec/${idSec}`;
    return this.http.get<Rspn<ActSection[]>>(url)
      .pipe(
        map(x => validate<ActSection[]>(x)
        ));
  }

  add(item: ActSection): Observable<string> {
    const url = `${environment.urlBase}/section/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActSection): Observable<string> {
    const url = `${environment.urlBase}/section/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/section/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
