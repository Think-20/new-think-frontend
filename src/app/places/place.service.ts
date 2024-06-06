import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Place } from './place.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from '../shared/pagination.model';
import { DataInfo } from '../shared/data-info.model';


@Injectable()
export class PlaceService {
  searchValue = {}
  pageIndex = 0

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  places(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `places/all?page=${page}` : `places/filter?page=${page}`

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

  place(placeId: number): Observable<Place> {
    let url = `places/get/${placeId}`

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(place: Place): Observable<any> {
    let url = 'place/save'

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(place),
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

  edit(place: Place): Observable<any> {
    let url = 'place/edit'

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(place),
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
    let url = `place/remove/${id}`

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
