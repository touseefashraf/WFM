import { apis } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) { }

    getAttendanceRequests(): Observable<any> {
        const url = `${apis.baseUrl}/employees/attendance-requests`

        return this.http.get<any>(url)
    }

    acceptRequest(params: any): Observable<any> {
        const url = `${this.baseUrl}/employees/approve-attendance-request`

        return this.http.post<any>(url, params)
    }

    rejectRequest(params: any): Observable<any> {
        const url = `${this.baseUrl}/employees/reject-attendance-request`

        return this.http.post<any>(url, params)
    }



}
