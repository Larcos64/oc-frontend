import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionService } from './session.service';
import { Rspn } from 'src/app/shared/models/response.model';
import { validate } from 'src/app/util/http-util';
import { AcsUser } from 'src/app/shared/models/acsuser.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  allPermis = [{ idPermis: 1, namePermis: 'Administrar' }];
  permitsAssignents = new Array();
  permisOfRole = new Array();

  permAdmin = '0';

  constructor(private http: HttpClient, private session: SessionService) { }

  login(username: string, pass: string) {
    var url = `${environment.urlBase}/user/login`;
    return this.http.post<Rspn<LoginResponse>>(url, {
      username: username,
      pass: pass
    }, {}).pipe(
      map(x => validate(x)),
      map(x => {
        // const { id, doc } = x.user;
        // const rol = doc.rol;

        this.session.token = x.token;
        this.session.logged = true;
        this.session.idUser = x.user.idUser.toString();
        this.session.idComp = x.user.idComp.toString();
        this.session.idProfUser = x.user.idProf.toString();
        this.session.nameUser = x.user.nameUser;
        this.session.lastnameUser = x.user.lastnameUser;
        this.session.emailUser = x.user.emailUser;

        return x;
      })
    );

  }

}

export class LoginResponse {
  user: AcsUser;
  token: string;
}
