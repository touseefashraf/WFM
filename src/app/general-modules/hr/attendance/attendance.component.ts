import { DataService } from './data.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { Component, OnInit } from '@angular/core'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Router, ActivatedRoute } from '@angular/router'
import * as moment from 'moment'

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
    dataStatus = 'fetching'
    designationList: any = []
    attendanceList: any = []
    moment = moment
    // page = 1
    pagination: any
    searched = false
    loginLoading = false
    date: any = null
    filters: any = {
        startDate: null,
        endDate: null,
        designationId: null,
        page: 1
    }
    loaderOptions = {
        rows: 5,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        private ds: DataService,
        public ui: UIHelpers,
        private alert: IAlertService,
        public router: Router,
        private route: ActivatedRoute,

    ) {
        const sub = this.route.queryParams.subscribe(params => {
            if (params.start_date) {
                this.filters.startDate = moment(params.start_date).format('YYYY-MM-DD')
            }
            if (params.end_date) {
                this.filters.endDate = moment(params.end_date).format('YYYY-MM-DD')
            }
            if (params.start_date && params.end_date) {
                const startdate = new Date(this.filters.startDate)
                const enddate = new Date(this.filters.endDate)
                this.date = [startdate, enddate]
            }
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.designation_id) {
                this.filters.designationId = params.designation_id
            }
            this.search()
        })
        sub.unsubscribe()
    }

    ngOnInit() {
        this.ds.getDesignationList().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.designationList = resp.data
            }
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.search()
    }

    search() {
        this.loginLoading = true
        if (this.date !== null) {
            this.filters.startDate = moment(this.date[0]).format('YYYY-MM-DD')
            this.filters.endDate = moment(this.date[1]).format('YYYY-MM-DD')
        }
        if (this.filters.designationId === 'null') {
            this.filters.designationId = null
        }
        this.searched = true
        this.dataStatus = 'fetching'
        const params = {
            start_date: this.filters.startDate,
            end_date: this.filters.endDate,
            desgination_id: this.filters.designationId,
            page: this.filters.page,
        }
        this.ds.getAttendanceList(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.attendanceList = resp.data.data
                console.log('attendanceList', this.attendanceList)
                this.pagination = resp.data
                this.dataStatus = 'done'
                console.log('params', params)

                this.router.navigate(['/admin/attendance'], { queryParams: params, replaceUrl: true })
            }
        })
    }
}
