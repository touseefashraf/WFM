import { ConstantsService } from 'src/app/services/constants.service';
import { DataService } from './data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
@Component({
    selector: 'app-dayend-report-details',
    templateUrl: './dayend-report-details.component.html',
    styleUrls: ['./dayend-report-details.component.css']
})
export class DayendReportDetailsComponent implements OnInit {
    moment = moment
    date: any = null
    dateFormat = this.cs.DATE_TIME_FORMAT.DATE_TIME
    filters: any = {
        from_date: null,
        to_date: null,
        employee_id: null
    }
    reportDetailsList = []
    dataStatus = false
    projectList = []
    employeeList = []
    loginLoading = false
    constructor(
        public cs: ConstantsService,
        public route: ActivatedRoute,
        public router: Router,
        public ds: DataService
    ) {
        this.ds.getEmployeeList().subscribe((resp: any) => {
            if (resp.success == true) {
                this.employeeList = resp.data
            }
        })
        this.route.queryParams.subscribe(params => {
            if (params.from_date) {
                this.filters.from_date = moment(params.from_date).format('YYYY-MM-DD 00:00:00')
            }
            if (params.to_date) {
                this.filters.to_date = moment(params.to_date).format('YYYY-MM-DD 00:00:00')
            }
            if (params.to_date && params.from_date) {
                console.log('asdf', this.filters);
                const fromDate = new Date(this.filters.from_date)
                const toDate = new Date(this.filters.to_date)
                this.date = [fromDate, toDate]
                // this.date.push(toDate)

            }
            if (params.employee_id) {
                this.filters.employee_id = params.employee_id
            }
            if (params) {
                this.search()
            } else {
                this.search()
            }
        })
    }
    search() {
        this.loginLoading = true
        if (this.date !== null) {
            this.filters.from_date = moment(this.date[0]).format('YYYY-MM-DD 00:00:00')
            this.filters.to_date = moment(this.date[1]).format('YYYY-MM-DD 00:00:00')
            delete this.filters.date
        }
        if (this.filters.employee_id == 'null') {
            this.filters.employee_id = null
        }

        this.ds.getDayEndReportList(this.filters).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success == true) {
                this.reportDetailsList = resp.data
                console.log('report list', this.reportDetailsList);

                this.ds.getProjectList().subscribe((resp: any) => {
                    this.loginLoading = false
                    if (resp.success == true) {
                        this.projectList = resp.data
                        this.dataStatus = true
                        const paramsToUpdate = { ...this.filters }
                        if (this.date !== null) {
                            paramsToUpdate.from_date = moment(this.date[0]).format('YYYY-MM-DD')
                            paramsToUpdate.to_date = moment(this.date[1]).format('YYYY-MM-DD')
                        } else {
                            paramsToUpdate.from_date = null
                            paramsToUpdate.to_date = null
                        }
                        this.router.navigate(['/admin/dayend-report-details'], { queryParams: paramsToUpdate })
                    }
                })
            }
        })
    }
    getTotalHours(report: any) {
        let totalHours = 0
        report.dayend_report_details.forEach(d => {
            totalHours += +d.hours
        })

        return totalHours
    }
    getProjectName(projectDetail) {
        const index = this.projectList.findIndex(d => d.id == projectDetail.project_id)
        if (index > -1) {
            return this.projectList[index].title
        } else {
            return ''
        }
    }
    getProjectRepoLink(projectDetail) {
        const index = this.projectList.findIndex(d => d.id == projectDetail.project_id)
        if (index > -1) {
            return this.projectList[index].repo_link
        } else {
            return ''
        }
    }
    ngOnInit() {
    }

}
