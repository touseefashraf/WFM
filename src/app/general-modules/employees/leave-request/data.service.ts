import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) {
    }

   

    get(params): Observable<any> {
        const url = `${this.baseUrl}/employees/leave-requests`

        return this.http.get<any>(url, { params })
    }

   
    delete(param): Observable<any> {
       
        const url = `${this.baseUrl}/employees/delete-leave-request`

        return this.http.post<any>(url, param)
    }

    acceptRequest(param): Observable<any> {
       
        const url = `${this.baseUrl}/employees/approve-leave-request`

        return this.http.post<any>(url, param)
    }

    rejectRequest(param): Observable<any> {
       
        const url = `${this.baseUrl}/employees/reject-leave-request`

        return this.http.post<any>(url, param)
    }

    
    

}
