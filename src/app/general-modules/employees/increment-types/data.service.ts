import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/account`

    constructor(public http: HttpClient) {
    }

    save(params: any): Observable<any> {
        const url = `${this.baseUrl}/add-increment-type`

        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-increment-type`

        return this.http.post<any>(url, params)
    }

    delete(param): Observable<any> {

        const url = `${this.baseUrl}/delete-increment-type`


        return this.http.post<any>(url, param)
    }

    list(): Observable<any> {
        const url = `${this.baseUrl}/increment-type-list`

        return this.http.get<any>(url)
    }
}
