import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Client } from './client.model';
import { AuthService } from '../login/auth.service';
import { Pagination } from '../shared/pagination.model';
import { DataInfo } from '../shared/data-info.model';


@Injectable()
export class ClientService {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }

  clients(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `clients/all?page=${page}` : `clients/filter?page=${page}`
    let prefix = this.auth.hasAccess('clients/all') ? '' : 'my-'

    url = prefix + url

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

  client(clientId: number): Observable<Client> {
    let url = `clients/get/${clientId}`
    let prefix = this.auth.hasAccess('clients/get/{id}') ? '' : 'my-'

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

  uploadSheet(file: any): Observable<any> {
    let requestOptions = new RequestOptions()
    let headers = new Headers()

    let user = this.auth.currentUser()
    let token = this.auth.token()

    headers.set('Authorization', `${token}`)
    headers.set('User', `${user.id}`)
    requestOptions.headers = headers

    let url = 'client/import'
    let data = new FormData()
    data.append('file', file, file.name)

    return this.http.post(`${API}/${url}`, data, requestOptions)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(client: Client): Observable<any> {
    let url = 'client/save'
    let prefix = this.auth.hasAccess('client/save') ? '' : 'my-'

    url = prefix + url

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(client),
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

  edit(client: Client): Observable<any> {
    let url = 'client/edit'
    let prefix = this.auth.hasAccess('client/edit') ? '' : 'my-'

    url = prefix + url

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(client),
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
    let url = `client/remove/${id}`
    let prefix = this.auth.hasAccess('client/remove/{id}') ? '' : 'my-'

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
