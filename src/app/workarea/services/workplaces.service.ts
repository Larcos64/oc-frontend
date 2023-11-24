import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { AcsWorkplace } from '../../shared/models/acsworkpace.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class WorkplacesService {

  constructor(private http: HttpClient) { }

  listByIdComp(idComp: number): Observable<AcsWorkplace[]> {
    const url = `${environment.urlBase}/workarea/id_comp/${idComp}`;
    return this.http.get<Rspn<AcsWorkplace[]>>(url)
      .pipe(
        map(x => validate<AcsWorkplace[]>(x)
        ));
  }

  add(item: AcsWorkplace): Observable<string> {
    const url = `${environment.urlBase}/workarea/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: AcsWorkplace): Observable<string> {
    const url = `${environment.urlBase}/workarea/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/workarea/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
