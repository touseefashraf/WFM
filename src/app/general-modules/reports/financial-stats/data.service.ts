import { apis } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Router } from '@angular/router'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/project`

    constructor(public http: HttpClient, private router: Router) {
    }

    getFinancialStats(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/financial-stats`

        return this.http.get<any>(url, {params})
    }
}
