import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActOptionValue } from '../../shared/models/actoptionvalue.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class OptvaluesService {

  constructor(private http: HttpClient) { }

  listByIdOpt(idOpt: number): Observable<any[]> {
    const url = `${environment.urlBase}/optvalue/id_opt/${idOpt}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  listByIdOptAssets(idOpt: number): Observable<any[]> {
    const url = `${environment.urlBase}/optvalue/id_opt_asts/${idOpt}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  gerByIdOptVal(idOptVal: number): Observable<any[]> {
    const url = `${environment.urlBase}/optvalue/id_opt_val/${idOptVal}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  add(item: ActOptionValue): Observable<string> {
    const url = `${environment.urlBase}/optvalue/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: ActOptionValue): Observable<string> {
    const url = `${environment.urlBase}/optvalue/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/optvalue/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

  deleteByIdOpt(idOpt: number): Observable<string> {
    const url = `${environment.urlBase}/optvalue/id_opt/${idOpt}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
