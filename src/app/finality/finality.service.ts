import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


import { API } from '../app.api';
import { Finality } from './finality.model';


@Injectable()
export class FinalityService {
    constructor(
        private http: Http
    ) {}

    finalities(): Observable<Finality[]> {
        return this.http.get(`${API}/finalities`)
            .map(response => response.json())
    }

    /*
    save(finality: finality): Observable<Finality> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')

        return this.http.post(
                `${API}/finalities`,
                JSON.stringify(finality),
                new RequestOptions({headers: headers})
            )
            .map(response => response.json())
    }

    delete(id: number): Observable<Finality> {
        return this.http.delete(`${API}/finalities/${id}`)
            .map(response => response.json())
    }
    */
}