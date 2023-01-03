import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) {
    }

    getFy(): Observable<any> {
        const url = `${this.baseUrl}/lov/fiscal-year-list`

        return this.http.get<any>(url)
    }

    addFy(params): Observable<any> {
        const url = `${this.baseUrl}/lov/add-fiscal-year`

        return this.http.post<any>(url, params)
    }

    updateFy(params): Observable<any> {
        const url = `${this.baseUrl}/lov/update-fiscal-year`

        return this.http.post<any>(url, params)
    }

}
