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
        const url = `${this.baseUrl}/add-income`

        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-income-category`

        return this.http.post<any>(url, params)
    }

    delete(param): Observable<any> {

        const url = `${this.baseUrl}/delete-income`


        return this.http.post<any>(url, param)
    }

    getCurrency(): Observable<any> {
        const url = `${apis.baseUrl}/lov/currency-list`

        return this.http.get<any>(url)
    }

    list(params): Observable<any> {
        const url = `${this.baseUrl}/incomes`

        return this.http.get<any>(url, {params})
    }

    IncomeCategories(): Observable<any> {
        const url = `${this.baseUrl}/income-categories`

        return this.http.get<any>(url)
    }

    ProjectList(): Observable<any> {
        const url = `${apis.baseUrl}/project/project-list`

        return this.http.get<any>(url)
    }


}
