import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { CostCategory } from './cost-category.model';
import { DataInfo } from 'app/shared/data-info.model';


@Injectable()
export class CostCategoryService {
  constructor(
    private http: Http,
    private snackBar: MatSnackBar
  ) { }

  searchValue = {}
  pageIndex = 0

  costCategories(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `cost-categories/all?page=${page}` : `cost-categories/filter?page=${page}`

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

  costCategory(costCategoryId: number): Observable<CostCategory> {
    return this.http.get(`${API}/cost-categories/get/${costCategoryId}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(costCategory: CostCategory): Observable<any> {
    return this.http.post(
      `${API}/cost-category/save`,
      JSON.stringify(costCategory),
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

  edit(costCategory: CostCategory): Observable<any> {
    return this.http.put(
      `${API}/cost-category/edit`,
      JSON.stringify(costCategory),
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

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/cost-category/remove/${id}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }
}
