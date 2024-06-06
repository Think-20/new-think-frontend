import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { JobHowCome } from './job-how-come.model';


@Injectable()
export class JobHowComeService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar
    ) {}

    howComes(query: string = ''): Observable<JobHowCome[]> {
        let url = query === '' ? `job-how-comes/all` : `job-how-comes/filter/${query}`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }
}
