import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { AcsCompany } from '../../shared/models/acscompany.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private http: HttpClient) { }

  list(): Observable<AcsCompany[]> {
    const url = `${environment.urlBase}/company/`;
    return this.http.get<Rspn<AcsCompany[]>>(url)
      .pipe(
        map(x => validate<AcsCompany[]>(x)
        ));
  }

  compById(id: number): Observable<AcsCompany[]> {
    const url = `${environment.urlBase}/company/${id}`;
    return this.http.get<Rspn<AcsCompany[]>>(url)
      .pipe(
        map(x => validate<AcsCompany[]>(x)
        ));
  }

  add(item: AcsCompany): Observable<string> {
    const url = `${environment.urlBase}/company/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  addLogo(formData: FormData, nit: number) {
    const url = `${environment.urlBase}/company/file/${nit}`;
    this.http.post<any>(url, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  // getLogos() {
  //   const url = `${environment.urlBase}/public`;
  //   return this.http.get<any>(url);
  // }

  edit(item: AcsCompany): Observable<string> {
    const url = `${environment.urlBase}/company/`;
    return this.http.put<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/company/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
