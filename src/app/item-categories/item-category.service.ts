import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';
import 'rxjs/add/operator/catch';


import { API } from '../app.api';
import { ItemCategory } from './item-category.model';
import { ErrorHandler } from '../shared/error-handler.service';
import { DataInfo } from 'app/shared/data-info.model';


@Injectable()
export class ItemCategoryService {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar
  ) { }

  searchValue = {}
  pageIndex = 0

  itemCategories(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `item-categories/all?page=${page}` : `item-categories/filter?page=${page}`

    return this.http.post(`${API}/${url}`,
      JSON.stringify(params),
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

  itemsGroupByCategory(query: string = ''): Observable<ItemCategory[]> {
    let url = query === '' ? `item-categories/items-group-by-category` : `item-categories/filter/${query}`

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  itemCategory(itemCategoryId: number): Observable<ItemCategory> {
    return this.http.get(`${API}/item-categories/get/${itemCategoryId}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(itemCategory: ItemCategory): Observable<any> {
    return this.http.post(
      `${API}/item-category/save`,
      JSON.stringify(itemCategory),
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

  edit(itemCategory: ItemCategory): Observable<any> {
    return this.http.put(
      `${API}/item-category/edit`,
      JSON.stringify(itemCategory),
      new RequestOptions()
    )
      .map(response => response.json())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/item-category/remove/${id}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }
}
