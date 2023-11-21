import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rspn } from '../../shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { ArRegisterFormat } from 'src/app/shared/models/arRegisterFormat';

@Injectable({
  providedIn: 'root'
})
export class DynamicformsService {

  constructor(private http: HttpClient) { }

  insert(data: any): Observable<string> {
    const url = `${environment.urlBase}/dynamicform/`;
    return this.http.post<Rspn<string>>(url, data).pipe(
      map(x => validate(x))
    );
  }

  addFile(formData: FormData, name: string) {
    const url = `${environment.urlBase}/dynamicform/file/${name}`;
    this.http.post<any>(url, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
}
