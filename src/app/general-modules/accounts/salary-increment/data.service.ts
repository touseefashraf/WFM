import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) { }

    getSalaryIncrements(params): Observable<any> {
        const url = `${this.baseUrl}/account/salary-increments`

        return this.http.get<any>(url, { params })
    }

    getEmployeeList(): Observable<any> {
        const url = `${apis.baseUrl}/employees/employee-list`

        return this.http.get<any>(url)
    }

}
