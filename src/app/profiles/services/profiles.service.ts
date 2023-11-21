import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { AcsProfile } from '../../shared/models/acsprofile.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private http: HttpClient) { }

  list(): Observable<AcsProfile[]> {
    const url = `${environment.urlBase}/profile/`;
    return this.http.get<Rspn<AcsProfile[]>>(url)
      .pipe(
        map(x => validate<AcsProfile[]>(x)
        ));
  }

  add(item: AcsProfile): Observable<string> {
    const url = `${environment.urlBase}/profile/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: AcsProfile): Observable<string> {
    const url = `${environment.urlBase}/profile/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/profile/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
