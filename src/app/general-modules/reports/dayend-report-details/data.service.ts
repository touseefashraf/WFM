import { ApiService } from './../../../services/api.service'
import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Router } from '@angular/router'


@Injectable()
export class DataService {
    step = 'personal-info'
    private baseUrl = `${apis.baseUrl}/project`

    constructor(public http: HttpClient, private router: Router, public api: ApiService) {
    }

    getDayEndReportList(params): Observable<any> {
        const url = `${this.baseUrl}/dayend-reports`

        return this.http.post<any>(url, params)
    }
    getProjectList(): Observable<any> {
        const url = `${this.baseUrl}/project-list`

        return this.http.get<any>(url)
    }

    getEmployeeList(): Observable<any> {
        const url = `${apis.baseUrl}/employees/employee-list`

        return this.http.get<any>(url)
    }
}
