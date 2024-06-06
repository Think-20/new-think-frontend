import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { ProjectFile } from './project-file.model';
import { AuthService } from '../login/auth.service';
import { Task } from '../schedule/task.model';
import { FileUploadServiceInterface } from 'app/shared/file-upload/file-upload-service.interface';
import { FileUploadInterface } from 'app/shared/file-upload/file-upload.interface';


@Injectable()
export class ProjectFileService implements FileUploadServiceInterface {
  data: ProjectFile = new ProjectFile
  task: Task = null

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  create(): FileUploadInterface {
    return new ProjectFile()
  }

  delete(id: number): Observable<any> {
    let url = `project-files/remove/${id}`

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
    return 'project-files/save-multiple'
  }

  downloadUrl(projectFile: FileUploadInterface) {
    return `project-files/download/${projectFile.id}`
  }

  viewUrl(projectFile: FileUploadInterface) {
    return `${API}/project-files/view/${projectFile.id}`
  }

  previewFileUrl(projectFile: FileUploadInterface) {
    return `project-files/download/${projectFile.id}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
  }

  downloadAllUrl(task: Task) {
    return `project-files/download-all/${task.id}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
  }
}
