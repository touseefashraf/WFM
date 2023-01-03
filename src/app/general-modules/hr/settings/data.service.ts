import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/lov`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient ) { }

    updateSettings(params): Observable<any> {
        const url = `${this.baseUrl}/update-settings`

        return this.http.post<any>(url, params)
    }
    getCurrentSettings(): Observable<any> {
        const url = `${this.baseUrl}/settings`

        return this.http.get<any>(url)
    }

    getCurrencys(): Observable<any> {
        const url = `${apis.baseUrl}/lov/currency-list`

        return this.http.get<any>(url)
    }

}
