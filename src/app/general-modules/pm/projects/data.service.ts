import { HttpClient } from '@angular/common/http'
import { apis } from './../../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { ApiService } from 'src/app/services/api.service'
import { Router } from '@angular/router'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/project`
    step: any = 'details'
    projectDetails: any = []
    step1Data: any = null
    selectedId: any = -1
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient, private api: ApiService, private router: Router) { }

    navigateWindow(obj: any) {
        this.step = obj.step
        this.router.navigate(['/admin/projects/' + obj.step], { queryParams: { id: obj.id }, replaceUrl: true })
        console.log('/admin/projects/' + obj.step)
    }

    getClients(): Observable<any> {
        const url = `${this.baseUrl}/client-list`

        return this.http.get<any>(url)
    }

    getCurrencys(): Observable<any> {
        const url = `${apis.baseUrl}/lov/currency-list`

        return this.http.get<any>(url)
    }

    // PROJECT LIST END POINTS

    projectsList(params): Observable<any> {
        const url = `${this.baseUrl}/project-list`

        return this.http.get<any>(url, { params })
    }

    projectSave(params): Observable<any> {
        const url = `${this.baseUrl}/save-project`

        return this.http.post<any>(url, params)
    }

    projectUpdate(params): Observable<any> {
        const url = `${this.baseUrl}/update-project`

        return this.http.post<any>(url, params)
    }

    projectDelete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-project`

        return this.http.post<any>(url, params)
    }

    // PROJECT DETAIL END POINTS

    getProjectDetails(id): Observable<any> {
        const url = `${this.baseUrl}/project-detail/${id}`

        return this.http.get<any>(url)
    }

    // PROJECT DOCUMENT END POINTS

    getProjectFile(id): Observable<any> {
        const url = `${this.baseUrl}/get-project-file/${id}`

        return this.http.get<any>(url, { responseType: 'blob' as 'json' })
    }

    getProjectDocuments(id): Observable<any> {
        const url = `${this.baseUrl}/project-documents/${id}`

        return this.http.get<any>(url)
    }

    uploadFile(formData: FormData) {
        const url = `${this.baseUrl}/save-project-file`

        return this.http.post<any>(url, formData)
    }

    deleteFile(params: any) {
        const url = `${this.baseUrl}/delete-project-file`

        return this.http.post<any>(url, params)
    }

    // MILE_STONE END POINTS

    getProjectMileStonesList(id) {
        const url = `${this.baseUrl}/get-project-milestone-list/${id}`

        return this.http.get<any>(url)
    }

    getPaymentDetailList(id) {
        const url = `${this.baseUrl}/project-payment-detail/${id}`

        return this.http.get<any>(url)
    }

    deleteMileStone(params): Observable<any> {
        const url = `${this.baseUrl}/delete-project-milestone`

        return this.http.post<any>(url, params)
    }

    addMileStone(params): Observable<any> {
        const url = `${this.baseUrl}/add-project-milestone`

        return this.http.post<any>(url, params)
    }

    updateMileStone(params): Observable<any> {
        const url = `${this.baseUrl}/update-project-milestone`

        return this.http.post<any>(url, params)
    }

    addProjectPayment(params): Observable<any> {
        const url = `${this.baseUrl}/add-project-payment`

        return this.http.post<any>(url, params)
    }

    // PROJECT CREDENTIALS END POINTS

    getProjectCredentialsList(id) {
        const url = `${this.baseUrl}/project-credential-list/${id}`

        return this.http.get<any>(url)
    }

    deleteCredentials(params): Observable<any> {
        const url = `${this.baseUrl}/delete-project-credential`

        return this.http.post<any>(url, params)
    }

    addCredentials(params): Observable<any> {
        const url = `${this.baseUrl}/add-project-credential`

        return this.http.post<any>(url, params)
    }

    updateCredentials(params): Observable<any> {
        const url = `${this.baseUrl}/update-project-credential`

        return this.http.post<any>(url, params)
    }

}
