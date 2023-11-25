import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { DynamicformsService } from '../../services/dynamicforms.service';
import { FileItem } from '../../models/FileItem';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fileinput',
  templateUrl: './fileinput.component.html',
  styleUrls: ['./fileinput.component.scss']
})
export class FileinputComponent implements OnInit {

  @Input() field: FieldConfig;
  @Input() form: FormGroup;

  fname: string;
  files;
  fileSelected: string | ArrayBuffer;
  filesToUpload2: FileItem[] = [];
  filesToUpload: MatTableDataSource<FileItem>;
  displayedColumns: string[] = ['Nombre', 'Tamaño', 'operation'];
  maxFiles = 1;
  errorMaxFile=false;

  constructor(private service: DynamicformsService) {

  }

  ngOnInit() {
    this.fname = this.field.name;
    this.maxFiles = parseInt(this.field.limit_file);

  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files;
      this.files = file;
      this.field.value = file;

    }
  }


  private fileCanBeUpload(file: File): boolean {
    if (!this.FileWasSelected(file.name) && this.isValidFormat(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  private FileWasSelected(fileName: string): boolean {

    for (const file of this.filesToUpload2) {
      if (file.nameFile === fileName) {
        console.log("El archivo ya se seleeciono");
        return true;
      }
    }

    return false;
  }

  private isValidFormat(typeFile: string): boolean {
    const extension = '.' + typeFile.split('/')[1];
    if (document.getElementById(this.fname).getAttribute('accept').split(', ').indexOf(extension) < 0) {
      alert(this.field.error);
      // if (!this.filesToUpload2.length) {
        this.form.controls[this.fname].setValue(null);
      // }
      return false;
    } else {
      return true;
    }

  }

  takeAllFiles(event) {
    const newfiles = event.target.files;

    for (const file of newfiles) {
      if (this.filesToUpload2.length < this.maxFiles) {

        if(this.fileCanBeUpload(file)){
          const tempFile = new FileItem(file);
          this.filesToUpload2.push(tempFile);
          this.refresData();
        }

      }else{
        this.errorMaxFile = true;
      }
    }

  }

  clearData() {
    this.filesToUpload2 = [];
  }

  refresData() {
    this.filesToUpload = new MatTableDataSource(this.filesToUpload2);
    // this.form.controls[this.fname].setValue(this.filesToUpload2);
    this.field.value = this.filesToUpload2;
  }

  delItem(filename: string) {
    this.errorMaxFile = false;
    this.filesToUpload2 = this.filesToUpload2.filter(file => file.nameFile !== filename);
    this.refresData();

  }

}
