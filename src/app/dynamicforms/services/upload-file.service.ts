import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
// import { finalize } from 'rxjs/operators';
// import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { FileItem } from '../models/FileItem';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  urlFile: string;

  // constructor(private firestorage: AngularFireStorage) { }
  constructor(private angularFireService: AngularFirestore, private http: HttpClient, private storage: AngularFireStorage) { }

  uploadFileToStorage(files: FileItem[]) {

    return new Promise((resolve, reject) => {
      let count = 0;
      let urls = [];
      const storageRef = firebase.storage().ref();

      for (const item of files) {

        item.uploading = true;

        if (item.progress >= 100) {
          continue;
        }

        const uploadTask: firebase.storage.UploadTask = storageRef.child(`files/${item.nameFile}`).put(item.file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,

          (error) => console.error(error, "no se subio el archivo"),

          () => {
            // console.log('archivo subido exitosamente');
            uploadTask.snapshot.ref.getDownloadURL()
              .then(url => {
                // this.urlFile = url
                // console.log('url del archivo es,', this.urlFile);
                // return this.urlFile;
                item.url = url;
                item.uploading = false;
                urls.push(url);
                count++;
                if (count == (files.length)) {
                  // console.log("url", urls, count)
                  resolve(urls)
                }
              });
          }
        )

      }
      // console.log("las url son", urls)

    })

    // return new Promise( (resolve, reject)=>{

    //   const path = `files/${file.name}`;
    //   const storageRef = this.firestorage.ref(path);
    //   const Task = this.firestorage.upload(path, file);

    //   Task.snapshotChanges().pipe(
    //     finalize(() => {
    //       storageRef.getDownloadURL().subscribe(urlFile => {
    //         resolve(urlFile);
    //       })
    //     })
    //   ).subscribe()
    // })
    // const storageRef = storage().ref();
    // const uploadTask: storage.UploadTask = storageRef.child(`files/${file.name}`).put(file)

    // uploadTask.on(storage.TaskEvent.STATE_CHANGED,
    //   (snapshot) => snapshot,

    //   (error) => console.error(error, "no se subio el archivo"),

    //   async () => {
    //     console.log('archivo subido exitosamente');
    //     uploadTask.snapshot.ref.getDownloadURL()
    //       .then(url => {
    //         this.urlFile = url
    //         console.log('url del archivo es,', this.urlFile);
    //         return this.urlFile;
    //       });
    //   }
    // )
  }

  deleteFile(filepath: string) {

    return new Promise((resolve, reject) => {
      var storageF = firebase.storage();
      var httpsReference = storageF.refFromURL(filepath);

      const ref = this.storage.ref(httpsReference['location'].path).delete().subscribe(res => {
        resolve(res);
      },
        err => reject(err))
    })
  }

  // const toDataURL = url => 


  // toDataURL('storage.googleapis.com/anovawebapp.appspot.com/'+url)
  //     .then(dataUrl => {
  //   console.log('RESULT:', dataUrl)
  // })

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

