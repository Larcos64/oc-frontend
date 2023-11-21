import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { AcsPermisRol } from '../../shared/models/acspermisrol.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class PermisrolService {

  constructor(private http: HttpClient) { }

  add(item: AcsPermisRol): Observable<string> {
    const url = `${environment.urlBase}/permisrol/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  deleteByIdProf(id: number): Observable<string> {
    const url = `${environment.urlBase}/permisrol/id_role/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

  listByIdProf(idProf: number): Observable<any[]> {
    const url = `${environment.urlBase}/permisrol/id_role/${idProf}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }
}
