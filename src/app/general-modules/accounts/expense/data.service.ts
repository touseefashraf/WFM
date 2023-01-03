import { apis } from './../../../../environments/environment'

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/account`
    private data = new BehaviorSubject<Array<any>>([{fetching: true}])
    public permissionsList = []


    constructor(public http: HttpClient) {
    }

    save(params: any): Observable<any> {
        const url = `${this.baseUrl}/add-expense`

        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-expense-category`

        return this.http.post<any>(url, params)
    }

    delete(param): Observable<any> {

        const url = `${this.baseUrl}/delete-expense`


        return this.http.post<any>(url, param)
    }

    list(params): Observable<any> {
        const url = `${this.baseUrl}/expenses`

        return this.http.get<any>(url,{params})
    }

    ExpenseCategories(): Observable<any> {
        const url = `${this.baseUrl}/expense-categories`

        return this.http.get<any>(url)
    }




}
