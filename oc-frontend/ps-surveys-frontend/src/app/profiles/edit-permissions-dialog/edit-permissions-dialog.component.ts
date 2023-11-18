import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { snackError, snackOk } from '../../util/snackbar-util';
import { PermissionsService } from '../../permissions/services/permissions.service';
import { PermisrolService } from '../../permisrol/services/permisrol.service';
import { AcsPermisRol } from '../../shared/models/acspermisrol.model';

@Component({
  selector: 'app-edit-permissions-dialog',
  templateUrl: './edit-permissions-dialog.component.html',
  styleUrls: ['./edit-permissions-dialog.component.scss']
})
export class EditPermissionsDialogComponent implements OnInit {

  form: FormGroup;
  permissionsData = [];
  permissionsFilter = [];
  dataPerRol = {};
  perRol = new AcsPermisRol();
  permisAssignment = new Array();
  loading = false;
  check=false

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditPermissionsDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public servicePerm: PermissionsService, public servicePermRol: PermisrolService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      permissions: new FormArray([])
    });

    this.addCheckboxes();
  }

  addCheckboxes() {
    // Obtaining all existing permits
    this.servicePerm.list().subscribe(perm => {
      this.permissionsData = perm;
      this.permissionsFilter = perm;
      // Obtaining all permissions assigned to the profile
      this.servicePermRol.listByIdProf(this.data.idProf).subscribe(permisrol => {
        this.permisAssignment = permisrol;
        // Iteration of each existing permission to create checkbox
        this.permissionsFilter.forEach((o, i) => {
          // Search by index of assigned permissions to check automatically
          let indice = this.permisAssignment.findIndex(permission => permission.id_permis === o.idPermis);
          if (indice >= 0) { // If it exists, check automatically
            var control = new FormControl(true);
          } else { // If it does not exist, do not check
            var control = new FormControl();
          }
          (this.form.controls.permissions as FormArray).push(control);
        });
      });
    });
  }

  buildPermissions() {
    this.loading = true;

    // If the form is modified, the permissions are cleaned
    if (this.form.dirty) {
      this.delPermissionsByIdProf(this.data.idProf);
    }

    // Collection of selected permission indices
    const selectedPermisIds = this.form.value.permissions
      .map((v, i) => (v ? this.permissionsFilter[i].idPermis : null))
      .filter(v => v !== null);

    // If any permission is selected, these are assigned
    if (typeof selectedPermisIds !== "undefined" && selectedPermisIds != null
      && selectedPermisIds.length != null
      && selectedPermisIds.length > 0) {

      // Permission update after 1 second to wait for cleaning
      setTimeout(() => {
        for (const idpermis of selectedPermisIds) {
          this.dataPerRol = {
            idProf: this.data.idProf,
            idPermis: idpermis
          };

          this.savePermissions(this.dataPerRol);
        }
      }, 1000);
    } else {
      this.router.navigate(['home/profiles'], { relativeTo: this.route });
      this.dialogRef.close();
    }
  }

  delPermissionsByIdProf(idProf) {
    (this.servicePermRol.deleteByIdProf(idProf)).pipe(
      finalize(() => this.loading = true)
    ).subscribe(() => this.loading = true, (err) => snackError(this.snackbar, err));
  }

  savePermissions(object) {
    this.perRol = new AcsPermisRol(object);
    console.log(this.perRol);
    
    (this.servicePermRol.add(this.perRol)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(), (err) => snackError(this.snackbar, err));
  }

  addOk() {
    snackOk(this.snackbar, 'Permisos asignados');
    this.loading = false;
    this.router.navigate(['home/profiles'], { relativeTo: this.route });
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    this.form = this.fb.group({
      permissions: new FormArray([])
    });
 
    this.permissionsFilter=this.permissionsData.filter((el) =>
      el.namePermis.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
    );

    // Iteration of each existing permission to create checkbox
    this.permissionsFilter.forEach((o, i) => {
      // Search by index of assigned permissions to check automatically
      let indice = this.permisAssignment.findIndex(permission => permission.id_permis === o.idPermis);
      if (indice >= 0) { // If it exists, check automatically
        var control = new FormControl(true);
      } else { // If it does not exist, do not check
        var control = new FormControl();
      }
      (this.form.controls.permissions as FormArray).push(control);
      
    });
  }

  checkall(event:MatCheckboxChange): void{
    if (event.checked) {
      this.form = this.fb.group({
        permissions: new FormArray([])
      });  
      // Iteration of each existing permission to create checkbox
      this.permissionsFilter.forEach((o, i) => {
          var control = new FormControl(true);
        (this.form.controls.permissions as FormArray).push(control);
      });
    }else{
      this.form = this.fb.group({
        permissions: new FormArray([])
      });  
      // Iteration of each existing permission to create checkbox
      this.permissionsFilter.forEach((o, i) => {
          var control = new FormControl();
        (this.form.controls.permissions as FormArray).push(control);
      });
    }
  }

}
