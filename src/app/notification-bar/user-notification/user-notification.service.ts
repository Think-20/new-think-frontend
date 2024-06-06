import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../../app.api';
import { ErrorHandler } from '../../shared/error-handler.service';
import { UserNotification } from './user-notification.model';
import { AuthService } from '../../login/auth.service';
import { Pagination } from '../../shared/pagination.model';
import { DataInfo } from '../../shared/data-info.model';


@Injectable()
export class UserNotificationService {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  userNotifications(page: number = 0): Observable<DataInfo> {
    let url = `notifications/all?page=${page}`

    return this.http.get(
      `${API}/${url}`,
      new RequestOptions()
    )
    .map(response => response.json())
    .catch((err) => {
      this.snackBar.open(ErrorHandler.message(err), '', {
        duration: 3000
      })
      return ErrorHandler.capture(err)
    })
  }

  recents(): Observable<DataInfo> {
    let url = `notifications/recents`

    return this.http.get(
      `${API}/${url}`,
      new RequestOptions()
    )
    .map(response => response.json())
    .catch((err) => {
      this.snackBar.open(ErrorHandler.message(err), '', {
        duration: 3000
      })
      return ErrorHandler.capture(err)
    })
  }

  listen(): Observable<UserNotification[]> {
    let url = `notifications/listen`

    return this.http.get(
      `${API}/${url}`,
      new RequestOptions()
    )
    .map(response => response.json())
    .catch((err) => {
      this.snackBar.open(ErrorHandler.message(err), '', {
        duration: 3000
      })
      return ErrorHandler.capture(err)
    })
  }

  read(userNotifications: UserNotification[]): Observable<any> {
    let url = 'notifications/read'
    let ids: number[] = []

    userNotifications.forEach(userNotification => {
      ids.push(userNotification.id)
    })

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify({ids: ids}),
      new RequestOptions()
    )
    .map(response => response.json())
    .catch((err) => {
      this.snackBar.open(ErrorHandler.message(err), '', {
        duration: 3000
      })
      return ErrorHandler.capture(err)
    })
  }
}
