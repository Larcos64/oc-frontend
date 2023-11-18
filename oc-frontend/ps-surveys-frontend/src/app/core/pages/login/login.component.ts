import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SessionService } from '../../services/session.service';
import { PermitsService } from '../../services/permits.service';
import { PermissionsService } from '../../../permissions/services/permissions.service';
import { PermisrolService } from '../../../permisrol/services/permisrol.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { snackError, snackOk } from 'src/app/util/snackbar-util';
import { Location } from '@angular/common';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  allPermis = new Array();
  permitsAssignents = new Array();
  permisOfRole = new Array();

  username: string;
  password: string;

  loading = false;

  permAdmin: boolean;

  constructor(private router: Router, private session: SessionService, private snackbar: MatSnackBar,
    private loginService: LoginService, public servicePermRol: PermisrolService, public servicePerm: PermissionsService,
    public servicePermits: PermitsService, public location: Location) { }

  ngOnInit() {
  }

  getPermits(idProf) {
    return new Promise((resolve, reject) => {

      this.servicePermRol.listByIdProf(idProf).subscribe(permisrol => {
        this.permitsAssignents = permisrol;
        localStorage.setItem('permissions', JSON.stringify(this.permitsAssignents));
        resolve(permisrol)
      }, err => reject(err));

    })
  }

  login() {
    this.loading = true;
    this.loginService.login(this.username, this.password)
      .pipe(finalize(() => this.loading = false)
      ).subscribe(data => {

        this.getPermits(data.user.idProf).then(permis => {

          localStorage.setItem('userLoged', JSON.stringify(data));

          localStorage.setItem('first', 'true')
          snackOk(this.snackbar, 'Usuario logeado correctamente');

          setTimeout(() => {
            this.router.navigate(['home', 'homePage']);
          }, 10);

        })

      },
        err => {
          snackError(this.snackbar, err);
        }
      );
  }

}
