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

    makeSalary(params): Observable<any> {
        const url = `${this.baseUrl}/account/generate-salaries`

        return this.http.post<any>(url, params)
    }
    getFiscalYears(): Observable<any> {
        const url = `${this.baseUrl}/lov/fiscal-year-list`

        return this.http.get<any>(url)
    }


}
