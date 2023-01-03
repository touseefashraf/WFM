import { apis } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/employees`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getLeavesList(params): Observable<any> {
        const url = `${this.baseUrl}/leaves`

        return this.http.get<any>(url, { params })
    }

    getDesignationList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/designation-list`

        return this.http.get<any>(url)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-user`

        return this.http.post<any>(url, params)
    }

}
