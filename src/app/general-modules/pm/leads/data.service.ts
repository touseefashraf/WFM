import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    public dbData = []
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) { }

    getLeadList(params): Observable<any> {
        const url = `${this.baseUrl}/project/lead-list`

        return this.http.get<any>(url,{params})
    }

    getCurrencyList(): Observable<any> {
        const url = `${this.baseUrl}/lov/currency-list`

        return this.http.get<any>(url)
    }

    addNew(params): Observable<any> {
        const url = `${this.baseUrl}/project/add-lead`

        return this.http.post<any>(url,params)
    }
    update(params): Observable<any> {
        const url = `${this.baseUrl}/project/update-lead`

        return this.http.post<any>(url,params)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/project/delete-lead`

        return this.http.post<any>(url,params)
    }

    addFollowup(params): Observable<any> {
        const url = `${this.baseUrl}/project/add-lead-followup`

        return this.http.post<any>(url,params)
    }
    updateFollowForm(params): Observable<any> {
        const url = `${this.baseUrl}/project/update-lead-followup`

        return this.http.post<any>(url,params)
    }

    deleteLeadFollowup(params): Observable<any> {
        const url = `${this.baseUrl}/project/delete-lead-followup`

        return this.http.post<any>(url,params)
    }

    getLeadFollowups(params): Observable<any> {
        const url = `${this.baseUrl}/project/lead-followup`

        return this.http.get<any>(url,{params})
    }

    getLeadDetails(params): Observable<any> {
        const url = `${this.baseUrl}/project/lead-detail`

        return this.http.get<any>(url,{params})
    }

    convertToProject(params): Observable<any> {
        const url = `${this.baseUrl}/project/lead-to-project`

        return this.http.post<any>(url,params)
    }

}
