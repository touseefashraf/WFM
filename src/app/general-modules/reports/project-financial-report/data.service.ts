import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './../../../services/api.service'
import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private baseUrl = `${apis.baseUrl}`
constructor(public http: HttpClient, public api: ApiService) {

}
getProjectList(): Observable<any> {
    const url = `${this.baseUrl}/project/project-list`

    return this.http.get<any>(url)
}
searchProjecDetails(params): Observable<any> {
    const url = `${this.baseUrl}/project/project-financial-report`

    return this.http.post<any>(url,params)

}

}
