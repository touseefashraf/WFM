import { apis } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/employees`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getAttendanceLog(params): Observable<any> {
      console.log('params sent',params);
      
      const url = `${this.baseUrl}/my-attendance`

      return this.http.get<any>(url, {params})
  }
  
    

}
