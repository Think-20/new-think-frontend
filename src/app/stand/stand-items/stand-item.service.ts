import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../../app.api';
import { ErrorHandler } from '../../shared/error-handler.service';
import { StandItem } from './stand-item.model';


@Injectable()
export class StandItemService {
    constructor(
        private http: Http,
        private snackBar: MatSnackBar
    ) {}

    defaultClosedItems(): Observable<StandItem[]> {
      return new Observable<StandItem[]>(subscriber => {
        let data = [
          {id: null, quantity: 1, title: 'Salas de reuniões', description: 'Mesa com 4 cadeiras e armário', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Bar', description: 'Balcão com banquetas', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Copa', description: 'Pia, geladeira, prateleiras', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Depósito', description: 'Lockers', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Lounge', description: 'Bistrôs, estar', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Atendimento', description: 'Mesa com 4 cadeiras', stand_item_type_id: 1},
          {id: null, quantity: 1, title: 'Exposição', description: 'Displays', stand_item_type_id: 1}
        ]
        subscriber.next(data)
        subscriber.complete()
      })
    }

    defaultOpenedItems(): Observable<StandItem[]> {
      return new Observable<StandItem[]>((subscriber) => {
        let data = [
          {id: null, quantity: 1, title: 'Vitrines', description: 'Fechadas com 4 prateleiras', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'Balcões', description: 'Balcão de atendimento', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'Displays', description: '..', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'TV', description: '42"', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'Video Wall', description: '8 telas', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'Mobiliário', description: 'Bistrôs', stand_item_type_id: 2},
          {id: null, quantity: 1, title: 'Lounge', description: '..', stand_item_type_id: 2}
        ]
        subscriber.next(data)
        subscriber.complete()
      })
    }
}
