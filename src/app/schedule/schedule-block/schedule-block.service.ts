import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../../app.api';
import { ErrorHandler } from '../../shared/error-handler.service';
import { AuthService } from '../../login/auth.service';
import { DataInfo } from '../../shared/data-info.model';
import { DatePipe } from '@angular/common';
import { ScheduleBlock } from './schedule-block.model';

@Injectable()
export class ScheduleBlockService {
  constructor(
    private http: Http,
    private datePipe: DatePipe,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  valid(): Observable<ScheduleBlock[]> {
    let url = this.authService.hasAccess('schedule-blocks/valid')
    ? `schedule-blocks/valid` : 'my-schedule-blocks/valid'

    return this.http.get(`${API}/${url}`,
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

  all(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = `schedule-blocks/all?page=${page}`

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

  save(scheduleBlock: ScheduleBlock): Observable<any> {
    let url = 'schedule-block/save'

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(scheduleBlock),
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
    let url = `schedule-block/remove/${id}`

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
