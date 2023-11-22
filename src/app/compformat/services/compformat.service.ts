import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ActsCompFormat } from '../../shared/models/actscompformat.model';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class CompformatService {

  constructor(private http: HttpClient) { }

  add(item: ActsCompFormat): Observable<string> {
    const url = `${environment.urlBase}/compformat/`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  listByIdForm(idFormat: number): Observable<ActsCompFormat[]> {
    const url = `${environment.urlBase}/compformat/id_form/${idFormat}`;
    return this.http.get<Rspn<ActsCompFormat[]>>(url)
      .pipe(
        map(x => validate<ActsCompFormat[]>(x)
        ));
  }

  listByIdComp(idComp: number): Observable<any[]> {
    const url = `${environment.urlBase}/compformat/id_comp/${idComp}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  listByIdCompBio(idComp: number): Observable<any[]> {
    const url = `${environment.urlBase}/compformat/biosec/${idComp}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  cfById(idCf: number): Observable<any[]> {
    const url = `${environment.urlBase}/compformat/id_cf/${idCf}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(
        map(x => validate<any[]>(x)
        ));
  }

  deleteByIdForm(idForm: number): Observable<string> {
    const url = `${environment.urlBase}/compformat/id_form/${idForm}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }
}
