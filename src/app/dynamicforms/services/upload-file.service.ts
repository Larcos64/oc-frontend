import { Injectable } from '@angular/core';
import { FileItem } from '../models/FileItem';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  urlFile: string;

  // constructor(private firestorage: AngularFireStorage) { }
  constructor() { }

  async dowloadFile(url: string): Promise<any> {

    const urlFinal = url.split("b/")[1];

    return await fetch(urlFinal)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          console.log(reader.result, "result")
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))

  }
}

