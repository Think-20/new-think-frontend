import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Event } from './event.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from '../shared/pagination.model';
import { DataInfo } from '../shared/data-info.model';


@Injectable()
export class EventService {
  searchValue = {}
  pageIndex = 0

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  previewFile(event: Event, type: string, file: string) {
    let url = `event/download/${event.id}/${type}/${file}?access_token=${this.auth.token()}&user_id=${this.auth.currentUser().id}`
    //let prefix = this.auth.hasAccess('event/download/{id}/{type}/{file}') ? '' : 'my-'

    //url = prefix + url

    window.open(`${API}/${url}`, '_blank')
  }

  events(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `events/all?page=${page}` : `events/filter?page=${page}`

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(params),
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

  event(eventId: number): Observable<Event> {
    let url = `events/get/${eventId}`

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(event: Event): Observable<any> {
    let url = 'event/save'

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(event),
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

  edit(event: Event): Observable<any> {
    let url = 'event/edit'

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(event),
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

  delete(id: number): Observable<any> {
    let url = `event/remove/${id}`

    return this.http.delete(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  jobEvents(params?: {}): Observable<DataInfo> {
    let url = params === '' ? `events/filter` : `events/filter`

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(params),
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
