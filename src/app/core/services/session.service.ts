import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  get idUser(): string {
    return this.get('idUser');
  }

  set idUser(idUser: string) {
    this.set('idUser', idUser);
  }

  get idComp(): string {
    return this.get('idComp');
  }

  set idComp(idComp: string) {
    this.set('idComp', idComp);
  }

  get idProfUser(): string {
    return this.get('idProfUser');
  }

  set idProfUser(idProfUser: string) {
    this.set('idProfUser', idProfUser);
  }

  get nameUser(): string {
    return this.get('nameUser');
  }

  set nameUser(nameUser: string) {
    this.set('nameUser', nameUser);
  }

  get lastnameUser(): string {
    return this.get('lastnameUser');
  }

  set lastnameUser(lastnameUser: string) {
    this.set('lastnameUser', lastnameUser);
  }

  get emailUser(): string {
    return this.get('emailUser');
  }

  set emailUser(emailUser: string) {
    this.set('emailUser', emailUser);
  }

  get permissions(): string {
    return this.get('permissions');
  }

  set permissions(permissions: string) {
    this.set('permissions', permissions);
  }

  get token(): string {
    return this.get('token');
  }

  set token(token: string) {
    this.set('token', token);
  }


  get logged(): boolean {
    return this.get('logged') === 'true';
  }

  set logged(logged: boolean) {
    this.set('logged', '' + logged);
  }


  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private get(key: string): string {
    return localStorage.getItem(key);
  }

  clear() {
    localStorage.clear();
  }

  // validatePerm(idProf: string) {
  // const pl = this.plan;
  // const limit = PLANS.find(x => x.name === pl).limit;
  // return size < limit;
  // if (idProf === '1') {
  //   this.admin = '2';
  // }
  // }
}
