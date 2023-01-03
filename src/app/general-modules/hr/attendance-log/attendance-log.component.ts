import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service';

@Component({
    selector: 'app-attendance-log',
    templateUrl: './attendance-log.component.html',
    styleUrls: ['./attendance-log.component.css']
})
export class AttendanceLogComponent implements OnInit {

    month = '1'
    dataStatus = 'fetching'
    year: any = 2020
    attendanceData: any;
    page = 1
    pagination: any
    startDate = null
    endDate = null
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }
    monthYear = moment().toDate()

    constructor(
        private alert: IAlertService,
        private ds: DataService,
        private route: ActivatedRoute,
        public router: Router,
    ) {

        const paramSub = this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params.month) {
                this.month = params.month
            }
            if (params.year) {
                this.year = params.year
            }
            if (params) {
                this.search()
            }

        })
        paramSub.unsubscribe()
    }

    ngOnInit() {
        console.log(this.monthYear)
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            month: this.monthYear.getMonth() + 1,
            year: this.monthYear.getFullYear(),
            page,
        }
        this.router.navigate(['/admin/attendance-log'], { queryParams: filtersParam, replaceUrl: true })
    }

    search() {
        this.loginLoading = true
        if (this.monthYear.getFullYear() > moment().year()) {
            this.alert.error('Year cant be greater then current year')
            this.loginLoading = false

            return false
        }
        const params = {
            page: this.page,
            month: this.monthYear.getMonth() + 1,
            year: this.monthYear.getFullYear(),
        }

        this.ds.getAttendanceLog(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === true) {
                this.attendanceData = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/attendance-log'], { queryParams: params, replaceUrl: true })
                console.log('Data Received', this.attendanceData)
            }
        })
    }
}
