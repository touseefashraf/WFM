import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'


@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) {
    }

    getCurrency(): Observable<any> {
        const url = `${this.baseUrl}/lov/currency-list`

        return this.http.get<any>(url)
    }

    addCurrency(params): Observable<any> {
        const url = `${this.baseUrl}/lov/add-currency`

        return this.http.post<any>(url, params)
    }

    updateCurrency(params): Observable<any> {
        const url = `${this.baseUrl}/lov/update-currency `

        return this.http.post<any>(url, params)
    }

    deleteCurrency(params): Observable<any> {
        const url = `${this.baseUrl}/lov/delete-currency`

        return this.http.post<any>(url, params)
    }


}

