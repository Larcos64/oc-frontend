import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActOption } from '../../shared/models/actoption.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private http: HttpClient) { }

  // add(item: ActOption): Observable<string> {
  //   const url = `${environment.urlBase}/option/`;
  //   return this.http.post<Rspn<string>>(url, item).pipe(
  //     map(x => validate(x))
  //   );
  // }

  list(): Observable<ActOption[]> {
    const url = `${environment.urlBase}/option/`;
    return this.http.get<Rspn<ActOption[]>>(url)
      .pipe(
        map(x => validate<ActOption[]>(x)
        ));
  }

  add(item: ActOption): Observable<ActOption[]> {
    const url = `${environment.urlBase}/option/`;
    return this.http.post<Rspn<ActOption[]>>(url, item)
      .pipe(
        map(x => validate<ActOption[]>(x)
        ));
  }

  edit(item: ActOption): Observable<string> {
    const url = `${environment.urlBase}/option/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/option/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

}
