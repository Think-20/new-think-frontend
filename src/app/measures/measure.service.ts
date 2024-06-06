import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Measure } from './measure.model';
import { AuthService } from '../login/auth.service';


@Injectable()
export class MeasureService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar,
        private auth: AuthService
    ) {}

    measures(query: string = ''): Observable<Measure[]> {
        let url = query === '' ? `measures/all` : `measures/filter/${query}`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    /*
    save(measure: Measure): Observable<Measure> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')

        return this.http.post(
                `${API}/measures`,
                JSON.stringify(measure),
                new RequestOptions({headers: headers})
            )
            .map(response => response.json())
    }

    delete(id: number): Observable<Measure> {
        return this.http.delete(`${API}/measures/${id}`)
            .map(response => response.json())
    }
    */
}