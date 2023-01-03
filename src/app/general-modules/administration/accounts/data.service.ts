import { apis } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Router } from '@angular/router'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    activeMenu = 'business'

    constructor(public http: HttpClient, private router: Router) {
    }

    getBankList(): Observable<any> {
        const url = `${apis.baseUrl}/account/bank-list`

        return this.http.get<any>(url)
    }
    getAccountList(): Observable<any> {
        const url = `${apis.baseUrl}/account/accounts-list`

        return this.http.get<any>(url)
    }

    add(params): Observable<any> {
        const url = `${apis.baseUrl}/account/add-account`

        return this.http.post<any>(url, params)
    }

    update(params): Observable<any> {
        const url = `${apis.baseUrl}/account/update-account`

        return this.http.post<any>(url, params)
    }

    delete(params): Observable<any> {
        const url = `${apis.baseUrl}/account/delete-account`

        return this.http.post<any>(url, params)
    }



}
