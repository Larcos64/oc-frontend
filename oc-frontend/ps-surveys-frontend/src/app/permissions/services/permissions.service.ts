import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { AcsPermission } from '../../shared/models/acspermission.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  list(): Observable<AcsPermission[]> {
    const url = `${environment.urlBase}/permission/`;
    return this.http.get<Rspn<AcsPermission[]>>(url)
      .pipe(
        map(x => validate<AcsPermission[]>(x)
        ));
  }

  add(item: AcsPermission): Observable<string> {
    const url = `${environment.urlBase}/permission/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: AcsPermission): Observable<string> {
    const url = `${environment.urlBase}/permission/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/permission/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
