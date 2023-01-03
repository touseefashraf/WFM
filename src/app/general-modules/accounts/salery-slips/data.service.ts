import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) { }

    getSalarySlips(params): Observable<any> {
        const url = `${this.baseUrl}/account/salary-slips`

        return this.http.get<any>(url, { params })
    }
    sendSalaries(params): Observable<any> {
        const url = `${this.baseUrl}/account/pay-salaries`

        return this.http.post<any>(url, params)
    }

    sendBonus(params): Observable<any> {
        const url = `${this.baseUrl}/account/add-bonus`

        return this.http.post<any>(url, params)
    }
    sendDeduction(params): Observable<any> {
        const url = `${this.baseUrl}/account/add-deduction`

        return this.http.post<any>(url, params)
    }

}
