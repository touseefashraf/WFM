import { apis } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    constructor(public http: HttpClient) { }

    getSalariesAggregate(params): Observable<any> {
        const url = `${apis.baseUrl}/account/salaries-aggregate`

        return this.http.get<any>(url, { params })
    }

}
