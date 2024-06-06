import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Briefing } from './briefing.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from 'app/shared/pagination.model';


@Injectable()
export class BriefingService {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}

  loadFormData(): Observable<any> {
    let url = `briefings/load-form`

    return this.http.get(`${API}/${url}`)
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
  }

  recalculateNextDate(nextEstimatedTime): Observable<any> {
    let url = `briefings/recalculate-next-date/${nextEstimatedTime}`

    return this.http.get(`${API}/${url}`)
        .map(response => response.json())
        .catch((err) => {
            this.snackBar.open(ErrorHandler.message(err), '', {
                duration: 3000
            })
            return ErrorHandler.capture(err)
        })
  }

  briefings(params?: {}, page: number = 0): Observable<Pagination> {
      let url = params === {} ? `briefings/all?page=${page}` : `briefings/filter?page=${page}`
      let prefix = this.auth.hasAccess('briefings/all') ? '' : 'my-'

      url = prefix + url

      return this.http.post(`${API}/${url}`,
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

  briefing(briefingId: number): Observable<Briefing> {
      let url = `briefings/get/${briefingId}`
      let prefix = this.auth.hasAccess('briefings/get/{id}') ? '' : 'my-'

      url = prefix + url

      return this.http.get(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  getNextAvailableDate(availableDate: string, estimatedTime: number, swap: boolean = false): Observable<any> {
    if(estimatedTime == undefined) estimatedTime = 1
      let url = `briefings/get-next-available-date/${availableDate}/${estimatedTime}/${swap}`

      return this.http.get(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }

  save(briefing: Briefing): Observable<any> {
      let url = 'briefing/save'
      let prefix = this.auth.hasAccess('briefing/save') ? '' : 'my-'

      url = prefix + url

      return this.http.post(
              `${API}/${url}`,
              JSON.stringify(briefing),
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

  edit(briefing: Briefing): Observable<any> {
      let url = 'briefing/edit'
      let prefix = this.auth.hasAccess('briefing/edit') ? '' : 'my-'

      url = prefix + url

      return this.http.put(
              `${API}/${url}`,
              JSON.stringify(briefing),
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

  editAvailableDate(briefing: Briefing): Observable<any> {
      let url = 'briefing/edit-available-date'
      let prefix = this.auth.hasAccess('briefing/edit-available-date') ? '' : 'my-'

      url = prefix + url

      return this.http.put(
              `${API}/${url}`,
              JSON.stringify(briefing),
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
      let url = `briefing/remove/${id}`
      let prefix = this.auth.hasAccess('briefing/remove/{id}') ? '' : 'my-'

      url = prefix + url

      return this.http.delete(`${API}/${url}`)
          .map(response => response.json())
          .catch((err) => {
              this.snackBar.open(ErrorHandler.message(err), '', {
                  duration: 3000
              })
              return ErrorHandler.capture(err)
          })
  }
}
