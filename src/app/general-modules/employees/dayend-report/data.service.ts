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
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient, private router: Router, public api: ApiService) {
    }

    getProjectList(): Observable<any> {
        const url = `${this.baseUrl}/project-list`

        return this.http.get<any>(url)
    }

    getReportDetails(params): Observable<any> {
        const url = `${this.baseUrl}/dayend-report`

        return this.http.post<any>(url, params)
    }

    dayEndReportList(): Observable<any> {
        const url = `${this.baseUrl}/dayend-report-list`

        return this.http.get<any>(url)
    }

    saveDetails(params): Observable<any> {
        const url = `${this.baseUrl}/add-dayend-report`

        return this.http.post<any>(url, params)
    }
    deleteReportDetail(params): Observable<any> {
        const url = `${this.baseUrl}/delete-dayend-task`

        return this.http.post<any>(url, params)
    }
}
