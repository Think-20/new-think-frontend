import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { JobEvents } from './job-events-model';


@Injectable()
export class JobEventsService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar
    ) {}

    jobeEventos(query: string = ''): Observable<JobEvents[]> {
        let url = query === '' ? `jobevents/filter` : `jobevents/filter/${query}`

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
