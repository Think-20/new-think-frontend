import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { SpecificationFile } from './specification-file.model';
import { AuthService } from '../login/auth.service';
import { Task } from '../schedule/task.model';
import { FileUploadServiceInterface } from 'app/shared/file-upload/file-upload-service.interface';
import { FileUploadInterface } from 'app/shared/file-upload/file-upload.interface';


@Injectable()
export class SpecificationFileService implements FileUploadServiceInterface {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  create(): FileUploadInterface {
    return new SpecificationFile
  }

  delete(id: number): Observable<any> {
    let url = `specification-files/remove/${id}`

    return this.http.delete(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  saveMultipleUrl(): string {
    return 'specification-files/save-multiple'
  }

  downloadUrl(specification: FileUploadInterface) {
    return `specification-files/download/${specification.id}`
  }

  viewUrl(specification: FileUploadInterface) {
    return `${API}/specification-files/view/${specification.id}`
  }

  previewFileUrl(specification: FileUploadInterface) {
    return `specification-files/download/${specification.id}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
  }

  downloadAllUrl(task: Task) {
    return `specification-files/download-all/${task.id}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
  }
}
