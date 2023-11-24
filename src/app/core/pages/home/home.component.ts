import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { Router } from "@angular/router";
import { toArray } from "rxjs/operators";
import { SessionService } from "src/app/core/services/session.service";
import { PermitsService } from "../../services/permits.service";
import { PermisrolService } from "../../../permisrol/services/permisrol.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  mobileQuery: MediaQueryList;
  shouldRun: boolean;

  permAdmin: boolean;
  permCompany: boolean;
  permBiosecurity: boolean;
  permProfiles: boolean;
  permPermissions: boolean;
  permFormats: boolean;
  permSections: boolean;
  permOptions: boolean;
  permReports: boolean;
  permitsAssignents = new Array();

  private _mobileQueryListener: () => void;

  // fillerNav = [
  //   { name: 'Empresas', route: '../home/companies', icon: 'business' },
  //   { name: 'Roles', route: '../home/profiles', icon: 'assignment_ind' },
  //   { name: 'Permisos', route: '../home/permissions', icon: 'vpn_key' },
  //   { name: 'Formatos', route: '../home/formats', icon: 'assignment' },
  //   { name: 'Secciones', route: '../home/sections', icon: 'vertical_split' },
  //   { name: 'Opciones', route: '../home/options', icon: 'ballot' }
  // ];
  fillerNav = new Array();
  menu = new Array();
  sessionData: any;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private session: SessionService,
    public servicePermRol: PermisrolService,
    public servicePermits: PermitsService
  ) {
    if (localStorage.getItem("first") === "true") {
      localStorage.removeItem("first");
      window.location.reload();
    }
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some((h) =>
      h.test(window.location.host)
    );
  }

  ngOnInit() {
    // this.permAdmin = this.servicePermits.validatePermit('Administrar');
    // console.log("LS: ", localStorage.getItem('permissions'));

    /* if (this.permAdmin) {
      this.fillerNav.push(
        { name: 'Empresas', route: '../home/companies', icon: 'business' },
        { name: 'Roles', route: '../home/profiles', icon: 'assignment_ind' },
        { name: 'Permisos', route: '../home/permissions', icon: 'vpn_key' },
        { name: 'Formatos', route: '../home/formats', icon: 'assignment' },
        { name: 'Secciones', route: '../home/sections', icon: 'vertical_split' },
        { name: 'Opciones', route: '../home/options', icon: 'ballot' },
        { name: 'Reportes', route: '../home/regformats', icon: 'assignment_turned_in' }
      );
    } else { */

    this.fillerNav.push({
      name: "Home",
      route: "../home/homePage",
      icon: "home",
    });
    this.permCompany = this.servicePermits.validatePermit("Empresas");
    if (this.permCompany) {
      this.fillerNav.push({
        name: "Empresas",
        route: "../home/companies",
        icon: "business",
      });
    }
    this.permProfiles = this.servicePermits.validatePermit("Roles");
    if (this.permProfiles) {
      this.fillerNav.push({
        name: "Roles",
        route: "../home/profiles",
        icon: "assignment_ind",
      });
    }
    this.permPermissions = this.servicePermits.validatePermit("Permisos");
    if (this.permPermissions) {
      this.fillerNav.push({
        name: "Permisos",
        route: "../home/permissions",
        icon: "vpn_key",
      });
    }
    this.permFormats = this.servicePermits.validatePermit("Formatos");
    if (this.permFormats) {
      this.fillerNav.push({
        name: "Encuestas",
        route: "../home/formats",
        icon: "assignment",
      });
    }
    this.permSections = this.servicePermits.validatePermit("Secciones");
    if (this.permSections) {
      this.fillerNav.push({
        name: "Secciones",
        route: "../home/sections",
        icon: "vertical_split",
      });
    }
    /* this.permOptions = this.servicePermits.validatePermit('Opciones');
    if (this.permOptions) {
      this.fillerNav.push(
        { name: 'Andres', route: '../home/options', icon: 'ballot' },
      );
    } */
    this.permReports = this.servicePermits.validatePermit("Reportes");
    if (this.permReports) {
      this.fillerNav.push({
        name: "Reportes",
        route: "../home/regformats",
        icon: "assignment_turned_in",
      });
    }
    // }

    this.menu = this.fillerNav;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
