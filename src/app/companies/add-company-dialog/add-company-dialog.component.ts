import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '../../../../node_modules/@angular/material';
import { finalize } from 'rxjs/operators';
import { AcsCompany } from '../../shared/models/acscompany.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { CompaniesService } from '../services/companies.service';
import { FileItem } from 'src/app/dynamicforms/models/FileItem';
import { UploadFileService } from 'src/app/dynamicforms/services/upload-file.service';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {

  form: FormGroup;
  company = new AcsCompany();
  loading = false;
  logo;
  logoSelected: string | ArrayBuffer;
  nit: number;

  constructor(private router: Router, private fb: FormBuilder, public service: CompaniesService,
    private snackbar: MatSnackBar, private route: ActivatedRoute, public dialogRef: MatDialogRef<AddCompanyDialogComponent>,
    private uploadFilesService: UploadFileService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      flagAdmin: ['', Validators.required],
      nameComp: ['', Validators.required],
      nitComp: ['', Validators.required],
      identLegalRep: ['', [Validators.required, Validators.min(9999999)]],
      nameLegalRep: ['', Validators.required],
      emailComp: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      addressComp: [''],
      phoneComp: [''],
      numEmployee: ['', Validators.required],
      logoComp: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  preSaveCompany() {
    this.loading = true;

    if (this.logo) {

      this.nit = this.form.get('nitComp').value;
      let ext = this.getFileExtension3(this.logo.name);
      this.form.controls.logoComp.setValue('/public/uploads/logos/' + this.nit + '.' + ext);
      this.saveCompany();

      /* const logoFile = new FileItem(this.logo);
      this.uploadFilesService.uploadFileToStorage([logoFile]).then((urlFile: string[]) => {
        this.form.controls.logoComp.setValue(urlFile[0]);
        this.saveCompany();
      }) */

    } else {
      this.saveCompany();
    }
  }

  saveCompany() {
    this.company = new AcsCompany(this.form.value);
    (this.service.add(this.company)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.addOk(this.nit), (err) => snackError(this.snackbar, err));
  }

  getFileExtension3(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  addOk(nit) {
    if (this.logo) {
      const formData = new FormData();
      formData.append('file', this.logo);
      this.service.addLogo(formData, nit);
    }

    snackOk(this.snackbar, 'Empresa registrada');
    this.router.navigate(['home/companies'], { relativeTo: this.route });
    this.dialogRef.close();
  }

  validateFormat(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.logo = file;
      // Get file extension
      let extension = this.logo.name.substring(this.logo.name.lastIndexOf('.'), this.logo.name.length);
      // If the obtained extension is not included in the value list of the "accept" attribute, it will show an error.
      if (document.getElementById('logoInput').getAttribute('accept').split(', ').indexOf(extension) < 0) {
        alert('Archivo inválido. Solo se permiten archivos con extensión (' + document.getElementById('logoInput').getAttribute('accept') + ')');
        this.form.controls.logoComp.setValue(null);
        this.logo = null;
        return false;
      } else {
        this.selectLogo(event);
      }
    }
  }

  selectLogo(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.logo = file;
      this.form.controls.logoComp.setValue(this.logo.name);

      const reader = new FileReader();
      reader.onload = e => this.logoSelected = reader.result;
      reader.readAsDataURL(file);
    }
  }
}
