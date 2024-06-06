import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';
import 'rxjs/add/operator/catch';


import { API } from '../app.api';
import { ItemType } from './item-type.model';
import { ErrorHandler } from '../shared/error-handler.service';


@Injectable()
export class ItemTypeService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar
    ) {}

    itemCategories(query: string = ''): Observable<ItemType[]> {
        let url = query === '' ? `item-types/all` : `item-types/filter/${query}`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    itemType(itemTypeId: number): Observable<ItemType> {
        return this.http.get(`${API}/item-types/get/${itemTypeId}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    save(itemType: ItemType): Observable<any> {
        return this.http.post(
                `${API}/item-type/save`,
                JSON.stringify(itemType),
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
    
    edit(itemType: ItemType): Observable<any> {
        return this.http.put(
                `${API}/item-type/edit`,
                JSON.stringify(itemType),
                new RequestOptions()
            )
            .map(response => response.json())
    }

    delete(id: number): Observable<ItemType> {
        return this.http.delete(`${API}/item-type/remove/${id}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }
}