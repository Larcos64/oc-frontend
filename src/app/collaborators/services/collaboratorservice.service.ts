import { Injectable } from '@angular/core';
import { AcsCollaborator } from 'src/app/shared/models/acscollaborator.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Rspn } from '../../shared/models/response.model';
import { map } from "rxjs/operators";
import { validate } from 'src/app/util/http-util';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorserviceService {

  constructor(private http:HttpClient) { }

  add(item: AcsCollaborator): Observable<string> {
    const url = `${environment.urlBase}/collaborator`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  getCollaboratorsByIdComp(idComp:number):Observable<AcsCollaborator[]>{
    const url = `${environment.urlBase}/collaborator/ByComp/${idComp}`;
    return this.http.get<Rspn<AcsCollaborator[]>>(url)
    .pipe(
      map( info=> validate<AcsCollaborator[]>(info) )
    )
  }

  getCollaboratorsById(idCol:number):Observable<AcsCollaborator>{
    const url = `${environment.urlBase}/collaborator/${idCol}`;
    return this.http.get<Rspn<AcsCollaborator>>(url)
    .pipe(
      map( info=> validate<AcsCollaborator>(info) )
    )
  }

  updateCol(item: AcsCollaborator): Observable<string> {
    const url = `${environment.urlBase}/collaborator/update-col`;
    return this.http.post<Rspn<string>>(url, item).pipe(
      map(x => validate(x))
    );
  }

  deleteCollaborator(idCol:number){
    const url = `${environment.urlBase}/collaborator/delete/${idCol}`;
    return this.http.delete<Rspn<string>>(url).pipe(
      map(x => validate(x))
    );
  }

}
