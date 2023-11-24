import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { ActVersionSection } from 'src/app/shared/models/actversionsection.model';
import { ActSection } from 'src/app/shared/models/actsection.model';

@Injectable({
  providedIn: 'root'
})
export class VersionSectionService {

  constructor(private http: HttpClient) { }

  listByIdVersion(idVersion: number): Observable<any[]> {
    const url = `${environment.urlBase}/versec/id_ver/${idVersion}`;
    return this.http.get<Rspn<any[]>>(url)
      .pipe(map(x => validate<any[]>(x)));
  }

  listByIdVersionInfoSection(idVersion: number): Observable<ActVersionSection[]> {
    const url = `${environment.urlBase}/versec/infoSection/id_ver/${idVersion}`;
    return this.http.get<Rspn<ActVersionSection[]>>(url)
      .pipe(map(x => validate<ActVersionSection[]>(x)));
  }

  listSectionsNoVersion(idVersion: number, idFormat: number): Observable<ActSection[]> {
    const url = `${environment.urlBase}/versec/sectionNoVersion/id_ver/${idVersion}/id_form/${idFormat}`;
    return this.http.get<Rspn<ActSection[]>>(url)
      .pipe(map(x => validate<ActSection[]>(x)));
  }

  add(item: ActVersionSection): Observable<string> {
    const url = `${environment.urlBase}/versec/`;
    return this.http.post<Rspn<string>>(url, item)
      .pipe(map(x => validate(x)));
  }

  delete(id: number): Observable<string> {
    const url = `${environment.urlBase}/versec/${id}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

  addSections(sectionsSelect: ActSection[], idVersion: number){
    const url = `${environment.urlBase}/versec/insertSections/id_ver/${idVersion}`;
    return this.http.post<Rspn<string>>(url, sectionsSelect).pipe(
      map(x => validate(x))
    );
  }

}
