import { ApiService } from './../../../services/api.service'
import { apis } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Router } from '@angular/router'


@Injectable()
export class DataService {
    step = 'personal-info'
    private baseUrl = `${apis.baseUrl}/employees`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient, private router: Router, public api: ApiService) {
    }

    navigateWindow(obj: any) {
        this.step = obj.step
        this.router.navigate(['/admin/employees/' + obj.step], { queryParams: { id: obj.id }, replaceUrl: true })
    }
    getBankList(): Observable<any> {
        const url = `${apis.baseUrl}/account/bank-list`

        return this.http.get<any>(url)
    }
    designationList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/designation-list`

        return this.http.get<any>(url)
    }

    getEmployeeSaleryDetails(params): Observable<any> {
        const url = `${apis.baseUrl}/account/employee-salary`

        return this.http.post<any>(url, params)
    }

    updateEmployeeSaleryDetails(params): Observable<any> {
        const url = `${apis.baseUrl}/account/update-employee-salary`

        return this.http.post<any>(url, params)
    }

    get(params): Observable<any> {
        const url = `${this.baseUrl}/employee-list`

        return this.http.get<any>(url, { params })
    }

    getPermissionsList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/permission-list`

        return this.http.get<any>(url)
    }
    getRolesList(): Observable<any> {
        const url = `${apis.baseUrl}/lov/role-list`

        return this.http.get<any>(url)
    }
    assignPermissions(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/assign-permissions `

        return this.http.post<any>(url, params)
    }
    assignRoles(params): Observable<any> {
        const url = `${apis.baseUrl}/lov/add-user-roles `

        return this.http.post<any>(url, params)
    }
    getEmployee(params): Observable<any> {
        const url = `${this.baseUrl}/employee-detail`

        return this.http.post<any>(url, params)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-employee`

        return this.http.post<any>(url, params)
    }

    add(params): Observable<any> {
        const url = `${this.baseUrl}/add-employee`

        return this.http.post<any>(url, params)
    }

    update(params): Observable<any> {
        const url = `${this.baseUrl}/update-employee`

        return this.http.post<any>(url, params)
    }

    getIncrementType(): Observable<any> {
        const url = `${apis.baseUrl}/account/increment-type-list`

        return this.http.get<any>(url)
    }

    addIncreamentSalary(params): Observable<any> {
        const url = `${apis.baseUrl}/account/increment-salary`

        return this.http.post<any>(url, params)
    }
}
