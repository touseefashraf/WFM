import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'

@Component({
    selector: 'app-employee-salary-log',
    templateUrl: './employee-salary-log.component.html',
    styleUrls: ['./employee-salary-log.component.css']
})
export class EmployeeSalaryLogComponent implements OnInit {
    dataStatus = 'fetching'
    employeeSalaryLogList: any = []
    employeeList: any = []
    employeeId = ''
    page = 1
    pagination: any
    searched = false
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        public alert: IAlertService,
        public route: ActivatedRoute,
        private router: Router
    ) {
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params.employee_id) {
                this.employeeId = params.employee_id
                this.search()
            }
        })
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
        // this.search()
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page,
            employee_id: this.employeeId
        }
        this.router.navigate(['/admin/employee-salary-log'], { queryParams: filtersParam, replaceUrl: true })
    }

    search() {
        this.loginLoading = true
        if (!this.employeeId) {
            this.alert.error('Please select employee')
            this.loginLoading = false

            return false
        }
        this.searched = true
        this.dataStatus = 'fetching'
        const params = {
            employee_id: this.employeeId,
            page: this.page,
        }
        this.ds.getEmployeeSalaryLog(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.employeeSalaryLogList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/employee-salary-log'], { queryParams: params, replaceUrl: true })

            }
        })
    }

}
