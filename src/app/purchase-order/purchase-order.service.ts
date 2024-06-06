import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


import { API } from '../app.api';
import { PurchaseOrder } from './purchase-order.model';


@Injectable()
export class PurchaseOrderService {
    constructor(
        private http: Http
    ) {}

    purchaseOrders(query:string = ''): Observable<PurchaseOrder[]> {
        return this.http.get(`${API}/purchase-orders${query}`)
            .map(response => response.json())
    }

    
    save(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json')

        return this.http.post(
                `${API}/purchase-orders`,
                JSON.stringify(purchaseOrder),
                new RequestOptions({headers: headers})
            )
            .map(response => response.json())
    }

    delete(id: number): Observable<PurchaseOrder> {
        return this.http.delete(`${API}/purchase-orders/${id}`)
            .map(response => response.json())
    }
    
}