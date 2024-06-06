import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';

import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { AuthService } from '../login/auth.service';
import { HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UploadFileService {
  constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private auth: AuthService
  ) {}

  /*
  uploadFile(form: FormGroup, key: string, inputFile: HTMLInputElement) {
    if(key.indexOf('.') > 0) {
      let keys = key.split('.')
      keys.forEach((value, index) => {
        if(index < keys.length) {
          form = <FormGroup> form.get(value)
        } else {
          key = value
        }
      })
    }

    form.get(key).setValue('Aguarde...')
    let files = inputFile.files
    let filename = ''

    for(var i = 0; i < files.length; i++) {
      filename += files.item(i).name.replace(/^C:\\fakepath\\/i, '') + ','
    }
    filename = filename.slice(0, filename.length - 1)

    this.sendToServer(form.get(key), files).subscribe((data) => {
      form.get(key).setValue(filename)
    })
  }
  */

  uploadFile(inputFile: HTMLInputElement, callbackProgress = (percentDone) => {}, callbackResponse = (response) => {}) {
    let files = inputFile.files
    return this.sendToServer(files, callbackProgress, callbackResponse)
  }

  private sendToServer(files: FileList, callbackProgress = (percentDone) => {}, callbackResponse = (response) => {}): Observable<any> {
      let user = this.auth.currentUser()
      let token = this.auth.token()
      let headers = new HttpHeaders({
        'Authorization': `${token}`,
        'User': `${user.id}`
      })

      let url = 'upload-file'
      let data = new FormData()

      for(var i = 0; i < files.length; i++)
      data.append(i.toString(), files.item(i), files.item(i).name)

      const req = new HttpRequest('POST', `${API}/${url}`, data, {
        reportProgress: true,
        headers: headers,
      });

      return this.http.request(req)
          .map(event => {
            if(event.type == HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              callbackProgress(percentDone)
            }
            if(event.type == HttpEventType.Response) {
              callbackResponse(event.body)
            }
          })
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }
}
