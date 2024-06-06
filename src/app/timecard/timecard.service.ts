import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/operator/debounceTime';
import 'rxjs/add/operator/catch';


import { API } from '../app.api';
import { Timecard } from './timecard.model';
import { ErrorHandler } from '../shared/error-handler.service';
import { AuthService } from '../login/auth.service';
import { Pagination } from '../shared/pagination.model';
import { Employee } from '../employees/employee.model';


@Injectable()
export class TimecardService {
    constructor(
        private http: Http,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {}

    hasAccess(module: string): boolean {
      let access: boolean = false
      switch(module) {
        case 'delete': {
          access = this.authService.hasAccess('employees/office-hours/remove/{id}')
          break;
        }
        case 'edit': {
          access = this.authService.hasAccess('employees/office-hours/edit')
          break;
        }
        case 'list': {
          access = this.authService.hasAccess('employees/office-hours/show/another')
          break;
        }
        case 'new': {
          access = this.authService.hasAccess('employees/office-hours/register/another')
          break;
        }
        case 'approve': {
          access = this.authService.hasAccess('employees/office-hours/approvals-pending/approve/{id}')
          break;
        }
        default: {
          break;
        }
      }
      return access
    }

    timecards(params?: {}): Observable<any> {
        let url = this.authService.hasAccess('employees/office-hours/show/another')
          ? `employees/office-hours/show/another` : 'employees/office-hours/show/yourself'

        return this.http.post(`${API}/${url}`,
              JSON.stringify(params)
            )
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    status(): Observable<Timecard[]> {
        return this.http.get(`${API}/employees/office-hours/status/yourself`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    approvalsPending(): Observable<Timecard[]> {
        let url = `employees/office-hours/approvals-pending/show`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    approve(id: number): Observable<any> {
        let url = `employees/office-hours/approvals-pending/approve/${id}`

        return this.http.get(`${API}/${url}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    timecard(timecardId: number): Observable<Timecard> {
        return this.http.get(`${API}/employees/office-hours/get/${timecardId}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    register(data): Observable<any> {
      let url = 'employees/office-hours/register/yourself'

        return this.http.post(
                `${API}/${url}`,
                JSON.stringify(data),
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

    save(timecard: Timecard): Observable<any> {
      /*
      let url = this.authService.hasAccess('employees/office-hours/register/another')
        ? `employees/office-hours/register/another` : 'employees/office-hours/register/yourself'
      */
      let url = `employees/office-hours/register/another`

        return this.http.post(
                `${API}/${url}`,
                JSON.stringify(timecard),
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

    edit(timecard: Timecard): Observable<any> {
        return this.http.put(
                `${API}/employees/office-hours/edit`,
                JSON.stringify(timecard),
                new RequestOptions()
            )
            .map(response => response.json())
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${API}/employees/office-hours/remove/${id}`)
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }
}
