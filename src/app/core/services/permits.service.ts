import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermitsService {

  constructor() { }

  validatePermit(permit: string) {
    let permitsAssignment = new Array();
    permitsAssignment = JSON.parse(localStorage.getItem('permissions'));

    const permitFound = permitsAssignment.find((obj) => obj.name_permis === permit);
    if (permitFound) {
      return true;
    } else {
      return false;
    }
  }
}
