import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) {
    }

    getClient(): Observable<any> {
        const url = `${this.baseUrl}/project/client-list`

        return this.http.get<any>(url)
    }

    addClient(params): Observable<any> {
        const url = `${this.baseUrl}/project/add-client`

        return this.http.post<any>(url, params)
    }

    updateClient(params): Observable<any> {
        const url = `${this.baseUrl}/project/update-client`

        return this.http.post<any>(url, params)
    }

    deleteClient(params): Observable<any> {
        const url = `${this.baseUrl}/project/delete-client`

        return this.http.post<any>(url, params)
    }

    clientImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/project/get-client-image/${id}`
    }

}

