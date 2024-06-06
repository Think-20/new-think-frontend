import { Injectable } from '@angular/core'; 
import { BaseRequestOptions, RequestOptionsArgs, RequestOptions } from '@angular/http';

@Injectable()
export class RequestOptionsApiService extends BaseRequestOptions {

    constructor() {
        super()
        this.headers.set('Content-Type', 'application/json')
    }

    merge(options?: RequestOptionsArgs): RequestOptions {
        const newOptions = super.merge(options)

        let user = JSON.parse(localStorage.getItem('currentUser')) || ''
        let token = localStorage.getItem('token') || ''

        newOptions.headers.set('Authorization', `${token}`)
        newOptions.headers.set('User', `${user.id}`)

        return newOptions
    }

}