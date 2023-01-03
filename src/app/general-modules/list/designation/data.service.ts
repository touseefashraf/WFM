import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/lov`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) { }

    list(): Observable<any> {
        const url = `${this.baseUrl}/designation-list`

        return this.http.get<any>(url)
    }

    add(params): Observable<any> {
        const url = `${this.baseUrl}/add-designation`

        return this.http.post<any>(url, params)
    }

    update(params): Observable<any> {
        const url = `${this.baseUrl}/update-designation`

        return this.http.post<any>(url, params)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-designation`

        return this.http.post<any>(url, params)
    }

}
