import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AcsUser } from '../../shared/models/acsuser.model';
import { AcsCompany } from '../../shared/models/acscompany.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  list(): Observable<AcsUser[]> {
    const url = `${environment.urlBase}/user/`;
    return this.http.get<Rspn<AcsUser[]>>(url)
      .pipe(
        map(x => validate<AcsUser[]>(x)
        ));
  }

  listByIdComp(idComp: number): Observable<AcsUser[]> {
    const url = `${environment.urlBase}/user/id_comp/${idComp}`;
    return this.http.get<Rspn<AcsUser[]>>(url)
      .pipe(
        map(x => validate<AcsUser[]>(x)
        ));
  }

  getById(id: number): Observable<AcsUser[]> {
    const url = `${environment.urlBase}/user/id/${id}`;
    return this.http.get<Rspn<AcsUser[]>>(url)
      .pipe(
        map(x => validate<AcsUser[]>(x)
        ));
  }

  add(item: AcsUser): Observable<string> {
    const url = `${environment.urlBase}/user/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  edit(item: AcsUser, chPass: number): Observable<string> {
    const url = `${environment.urlBase}/user/${chPass}`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  editInfo(item: AcsUser): Observable<string> {
    const url = `${environment.urlBase}/user/update`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/user/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

  listCompanies(): Observable<AcsCompany[]> {
    const url = `${environment.urlBase}/company/`;
    return this.http.get<Rspn<AcsCompany[]>>(url)
      .pipe(
        map(x => validate<AcsCompany[]>(x)
        ));
  }
}
