import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'


@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) {
    }
    rolesList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/role-list`

        return this.http.get<any>(url)
    }

    getPermissionsList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/permission-list`

        return this.http.get<any>(url)
    }

    addRole(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/create-role`

        return this.http.post<any>(url, params)
    }
    updateRole(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/update-role-permission`

        return this.http.post<any>(url, params)
    }

    deleteRole(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/delete-role`

        return this.http.post<any>(url, params)
    }

}

