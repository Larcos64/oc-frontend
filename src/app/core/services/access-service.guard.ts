import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackError, snackOk } from 'src/app/util/snackbar-util';

@Injectable({
  providedIn: 'root'
})
export class AccessServiceGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router, private snackbar: MatSnackBar) { }

  canActivate(): boolean {
    if (this.session.logged) {
      return true;
    }

    this.router.navigate(['login']);
    snackError(this.snackbar, 'Inicio de sesión requerido');
    return false;
  }

}
