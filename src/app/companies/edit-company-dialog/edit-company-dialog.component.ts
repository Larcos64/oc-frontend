import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { AcsCompany } from '../../shared/models/acscompany.model';
import { snackError, snackOk } from '../../util/snackbar-util';
import { CompaniesService } from '../services/companies.service';
import { environment } from 'src/environments/environment';
import { FileItem } from 'src/app/dynamicforms/models/FileItem';
import { UploadFileService } from 'src/app/dynamicforms/services/upload-file.service';

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
  styleUrls: ['./edit-company-dialog.component.scss']
})
export class EditCompanyDialogComponent implements OnInit {

  form: FormGroup;
  company = new AcsCompany();
  loading = false;
  logo;
  logoSelected: string | ArrayBuffer;
  srcLogo: string;
  nit: number;

  constructor(private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<EditCompanyDialogComponent>,
    private snackbar: MatSnackBar, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any,
    public service: CompaniesService, private uploadFilesService: UploadFileService) { }

  ngOnInit() {

    this.initForm();
    this.srcLogo = this.data["logoComp"];
  }

  initForm() {
    this.form = this.fb.group({
      idComp: [this.data.idComp, Validators.required],
      flagAdmin: [this.data.flagAdmin, Validators.required],
      nameComp: [this.data.nameComp, Validators.required],
      nitComp: [this.data.nitComp, Validators.required],
      identLegalRep: [this.data.identLegalRep, [Validators.required, Validators.min(9999999)]],
      nameLegalRep: [this.data.nameLegalRep, Validators.required],
      emailComp: [this.data.emailComp, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      addressComp: [this.data.addressComp],
      phoneComp: [this.data.phoneComp],
      numEmployee: [this.data.numEmployee, Validators.required],
      logoComp: [this.data.logoComp]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  editCompany() {
    this.loading = true;

    if (this.logo) {

      this.nit = this.form.get('nitComp').value;
      const oldLogo = this.form.get('logoComp').value ? this.form.get('logoComp').value : '';

      if (oldLogo) {
        this.uploadWithLogo(oldLogo);
      } else {
        this.saveEdit();
      }

    } else {
      this.saveEdit();
    }

  }

  uploadWithLogo(oldlogo: string) {

    const logoFile = new FileItem(this.logo);

    this.uploadFilesService.deleteFile(oldlogo).then(() => {
      this.saveLogoAndInfo(logoFile);
    })
      .catch(err => {
        console.log("error, ", err.code)
        if (err.code === 'storage/object-not-found') {
          this.saveLogoAndInfo(logoFile);
        }
      })
  }

  saveLogoAndInfo(logo: FileItem) {
    this.uploadFilesService.uploadFileToStorage([logo]).then((urlFile: string[]) => {
      this.form.controls.logoComp.setValue(urlFile[0]);
      this.saveEdit();
    })
  }

  saveEdit() {
    this.company = new AcsCompany(this.form.value);
    (this.service.edit(this.company)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => this.editOk(this.nit), (err) => snackError(this.snackbar, err));
  }


  getFileExtension3(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  editOk(nit) {
    if (this.logo) {
      const formData = new FormData();
      formData.append('file', this.logo);
      this.service.addLogo(formData, nit);
    }

    snackOk(this.snackbar, 'Empresa actualizada');
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

      const reader = new FileReader();
      reader.onload = e => this.logoSelected = reader.result;
      reader.readAsDataURL(file);
    }
  }

  dow(){
    this.uploadFilesService.dowloadFile('https://firebasestorage.googleapis.com/v0/b/anovawebapp.appspot.com/o/files%2F368750-PBCLHI-746.jpg?alt=media&token=1cfd31de-13f1-4cf1-a9f5-79d3dff4b78d')
    .then( base64 => console.log(base64) )
  }
}
