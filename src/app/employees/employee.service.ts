import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';


import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';
import { Employee } from './employee.model';
import { AuthService } from '../login/auth.service';
import { DataInfo } from '../shared/data-info.model';


@Injectable()
export class EmployeeService {
  searchValue = {}
  pageIndex = 0

  constructor(
    private http: Http,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) { }


  employees(params?: {}, page: number = 0): Observable<DataInfo> {
    let url = params === {} ? `employees/all?page=${page}` : `employees/filter?page=${page}`
    let prefix = this.auth.hasAccess('employees/all') ? '' : 'my-'

    url = prefix + url

    return this.http.post(
      `${API}/${url}`,
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

  employee(employeeId): Observable<Employee> {
    let url = `employees/get/${employeeId}`
    let prefix = this.auth.hasAccess('employees/get/{id}') ? '' : 'my-'

    url = prefix + url

    return this.http.get(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  canInsertClients(params: { deleted : boolean } = { deleted : false }): Observable<Employee[]> {
    let url = `employees/can-insert-clients`

    return this.http.get(`${API}/${url}?deleted=${ params.deleted }`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }

  save(employee: Employee): Observable<any> {
    let url = 'employee/save'
    let prefix = this.auth.hasAccess('employee/save') ? '' : 'my-'

    url = prefix + url

    return this.http.post(
      `${API}/${url}`,
      JSON.stringify(employee),
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

  edit(employee: Employee): Observable<any> {
    let url = 'employee/edit'
    let prefix = this.auth.hasAccess('employee/edit') ? '' : 'my-'

    url = prefix + url

    return this.http.put(
      `${API}/${url}`,
      JSON.stringify(employee),
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

  toggleDeleted(id: number): Observable<any> {
    let url = `employee/toggle-deleted/${id}`
    let prefix = this.auth.hasAccess('employee/toggle-deleted/{id}') ? '' : 'my-'

    url = prefix + url

    return this.http.delete(`${API}/${url}`)
      .map(response => response.json())
      .catch((err) => {
        this.snackBar.open(ErrorHandler.message(err), '', {
          duration: 3000
        })
        return ErrorHandler.capture(err)
      })
  }
}
