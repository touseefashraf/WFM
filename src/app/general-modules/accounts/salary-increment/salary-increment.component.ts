import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-salary-increment',
    templateUrl: './salary-increment.component.html',
    styleUrls: ['./salary-increment.component.css']
})
export class SalaryIncrementComponent implements OnInit {
    dataStatus = 'fetching'
    salaryIncrementList: any = []
    employeeList: any = []
    employeeId = ''
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        public alert: IAlertService,
        public route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.ds.getEmployeeList().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.employeeList = resp.data
            }
        })
        this.search()
    }

    search() {
        this.loginLoading = true
        this.dataStatus = 'fetching'
        const params = {
            employee_id: this.employeeId
        }
        this.ds.getSalaryIncrements(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.salaryIncrementList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

}
