import { Injectable } from '@angular/core';
import { Http } from '@angular/http'; 

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { API } from '../app.api';
import { City } from './city.model';

@Injectable()
export class CityService {
    constructor(
        private http: Http
    ) {}

    cities(stateId: number, cityName: string): Observable<City[]> {
        return this.http
            .get(`${API}/cities/${stateId}/${cityName}`)
            .map(response => response.json())
    }
}