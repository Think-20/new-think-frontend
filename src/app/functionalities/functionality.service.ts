import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Functionality } from './functionality.model';
import { AuthService } from '../login/auth.service';
import { DataInfo } from '../shared/data-info.model';


@Injectable()
export class FunctionalityService {
  searchValue = {}
  pageIndex = 0

    constructor(
        private http: Http,
        private snackBar: MatSnackBar,
        private auth: AuthService
    ) {}


    functionalities(params?: {}, page: number = 0): Observable<DataInfo> {
      let url = params === {} ? `functionalities/all?page=${page}` : `functionalities/filter?page=${page}`

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

    functionality(functionalityId): Observable<Functionality> {
        let url = `functionalities/get/${functionalityId}`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    save(functionality: Functionality): Observable<any> {
        let url = 'functionality/save'

        return this.http.post(
                `${API}/${url}`,
                JSON.stringify(functionality),
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

    edit(functionality: Functionality): Observable<any> {
        let url = 'functionality/edit'

        return this.http.put(
                `${API}/${url}`,
                JSON.stringify(functionality),
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
        let url = `functionality/remove/${id}`

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
