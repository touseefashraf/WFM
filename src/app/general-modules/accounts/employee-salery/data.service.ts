import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/account`
    constructor(public http: HttpClient) {
    }

    getEmployeeList(): Observable<any> {
        const url = `${apis.baseUrl}/employees/employee-list`

        return this.http.get<any>(url)
    }

    getEmployeeSaleryList(): Observable<any> {
        const url = `${this.baseUrl}/employee-salary-list`

        return this.http.get<any>(url)
    }

    deleteEmployeeSalery(params): Observable<any> {
        const url = `${this.baseUrl}/delete-employee-salary`

        return this.http.post<any>(url, params)
    }

    addEmployeeSalery(params): Observable<any> {
        const url = `${this.baseUrl}/add-employee-salary`

        return this.http.post<any>(url, params)
    }

    updateEmployeeSalery(params): Observable<any> {
        const url = `${this.baseUrl}/update-employee-salary`

        return this.http.post<any>(url, params)
    }
}
