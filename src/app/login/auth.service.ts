import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { API } from '../app.api';
import { ErrorHandler } from '../shared/error-handler.service';

import { User } from '../user/user.model';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

@Injectable()
export class AuthService {
    constructor(
        private http: Http,
        private datePipe: DatePipe,
        private snackBar: MatSnackBar
    ) { }

    async isLogged() {
      return this.token() != null && (await this.validToken())
    }

    async validToken() {
      if(sessionStorage.getItem('validToken') != null) {
        return sessionStorage.getItem('validToken') === 'true'
      }

      let data = await this.checkToken().toPromise()
      this.setValidToken(data.status)
      return sessionStorage.getItem('validToken') === 'true'
    }

    login(data): Observable<any> {
        let url = `${API}/login`

        return this.http
            .post(url, JSON.stringify(data))
            .map(response => response.json())
            .catch((err) => {
                this.snackBar.open(ErrorHandler.message(err), '', {
                    duration: 3000
                })
                return ErrorHandler.capture(err)
            })
    }

    checkToken(): Observable<any> {
        let url = `${API}/check-token`

        return this.http
            .get(url)
            .map(response => response.json())
    }

    setValidToken(status: boolean) {
      sessionStorage.setItem('validToken', status ? 'true' : 'false')
    }

    logout() {
        let url = `${API}/logout`

        if(this.currentUser()) {
            this.http
                .post(url, '')
                .catch((err) => {
                    this.snackBar.open(ErrorHandler.message(err), '', {
                        duration: 3000
                    })
                    return ErrorHandler.capture(err)
                })
                .subscribe(res => {
                    this.clear()
                })
        }
    }

    queryAccess() {
      return `access_token=${this.token()}&user_id=${this.currentUser().id}`
    }

    setData(data) {
        localStorage.setItem('currentUser', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
    }

    clear() {
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
    }

    currentUser(): User {
        let currentUser = localStorage.getItem('currentUser')
        return JSON.parse(currentUser)
    }

    hasAccess(url: string): boolean {
        let urlWithBar = '/' + url

        let currentUser = this.currentUser()
        let isMaster: boolean = false

        this.currentUser().functionalities.map(funcionality => {
            return funcionality.url
        }).forEach(functionality => {
            if(functionality === urlWithBar) isMaster = true
        })

        return isMaster;
    }

    hasDisplay(url: string): boolean {
        let urlWithBar = '/' + url
        let isMaster: boolean = false

        this.currentUser().displays.forEach(display => {
            if(display.url === urlWithBar && display.access === 'Y') isMaster = true
        })

        return isMaster;
    }

    token() {
        return localStorage.getItem('token')
    }
}
