import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/account`
    constructor(public http: HttpClient) {
    }

    getBanks(): Observable<any> {
        const url = `${this.baseUrl}/bank-list`

        return this.http.get<any>(url)
    }

    deleteBank(params): Observable<any> {
        const url = `${this.baseUrl}/delete-bank`

        return this.http.post<any>(url, params)
    }

    addBank(params): Observable<any> {
        const url = `${this.baseUrl}/add-bank`

        return this.http.post<any>(url, params)
    }

    updateBank(params): Observable<any> {
        const url = `${this.baseUrl}/update-bank`

        return this.http.post<any>(url, params)
    }
}
