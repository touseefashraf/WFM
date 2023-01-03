import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) { }

    getEmployeeSalaryLog(params): Observable<any> {
        const url = `${this.baseUrl}/account/employee-salary-log`

        return this.http.get<any>(url, { params })
    }

    getEmployeeList(): Observable<any> {
        const url = `${apis.baseUrl}/employees/employee-list`

        return this.http.get<any>(url)
    }
}
