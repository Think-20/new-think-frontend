import { Injectable } from '@angular/core';
import { Http } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { API } from '../app.api';
import { State } from './state.model';

@Injectable()
export class StateService {
    constructor(
        private http: Http
    ) {}

    states(stateName: string = 'all'): Observable<State[]> {
        return this.http.get(`${API}/states/${stateName}`).map(response => response.json())
    }
}