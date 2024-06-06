import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { JobCompetition } from './job-competition.model';


@Injectable()
export class JobCompetitionService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar
    ) {}

    jobCompetitions(query: string = ''): Observable<JobCompetition[]> {
        let url = query === '' ? `job-competitions/all` : `job-competitions/filter/${query}`

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
