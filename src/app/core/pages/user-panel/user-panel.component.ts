import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../services/session.service';
import { UsersService } from '../../../users/services/users.service';
import { UserInfoDialogComponent } from '../user-info-dialog/user-info-dialog.component';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  fullNameUser: string;

  userInfo = new Array();
  idUser: string;
  idComp: string;
  idProf: string;
  identUser: string;
  nameUser: string;
  lastnameUser: string;
  rhUser: string;
  genderUser: string;
  dateBirthUser: string;
  entailmentDateUser: string;
  dobgUser: string;
  emailUser: string;

  uiDialogRef: MatDialogRef<UserInfoDialogComponent>;

  constructor(private router: Router, private session: SessionService, public service: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.idUser = this.session.idUser;
    /* this.fullNameUser = this.session.nameUser + ' ' + this.session.lastnameUser;
    this.emailUser = this.session.emailUser; */
    this.getUserInfo();
  }

  getUserInfo() {
    this.service.getById(parseInt(this.idUser)).subscribe(info => {
      this.userInfo = info;

      this.fullNameUser = this.userInfo['nameUser'] + ' ' + this.userInfo['lastnameUser'];
      this.idUser = this.userInfo['idUser'];
      this.idComp = this.userInfo['idComp'];
      this.idProf = this.userInfo['idProf'];
      this.identUser = this.userInfo['identUser'];
      this.nameUser = this.userInfo['nameUser'];
      this.lastnameUser = this.userInfo['lastnameUser'];
      this.rhUser = this.userInfo['rhUser'];
      this.genderUser = this.userInfo['genderUser'];
      this.dateBirthUser = this.userInfo['dateBirthUser'];
      this.entailmentDateUser = this.userInfo['entailmentDateUser'];
      this.emailUser = this.userInfo['emailUser'];
    });
  }

  editInfo(idUser: number, idComp: number, idProf: number, identUser: number, nameUser: string, lastnameUser: string, rhUser: string, genderUser: string, dateBirthUser, entailmentDateUser: number, emailUser: string) {
    // console.log(this.index);
    this.uiDialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '400px',
      height: 'auto',
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        idUser, idComp, idProf, identUser, nameUser, lastnameUser, rhUser, genderUser, dateBirthUser, entailmentDateUser, emailUser
      }
    });

    this.uiDialogRef.afterClosed().subscribe(result => {
      // this.getUsers();
    });
  }

  logout() {
    this.session.clear();
    this.router.navigate(['login']);
  }

}
