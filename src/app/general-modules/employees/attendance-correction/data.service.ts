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

    getMyAttandanceRequests(): Observable<any> {
        const url = `${this.baseUrl}/employees/my-attendance-requests`

        return this.http.get<any>(url)
    }
    addNewRequests(params): Observable<any> {
        const url = `${this.baseUrl}/employees/attendance-request`

        return this.http.post<any>(url,params)
    }

    deleteRequests(params): Observable<any> {
        const url = `${this.baseUrl}/employees/delete-attendance-request`

        return this.http.post<any>(url,params)
    }

}
