import { IAlertService } from './../../libs/ialert/ialerts.service';
import { ApiService } from './../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    mt = moment
    month = ''
    year: any = 2020
    todayDate = new Date()
    lineChartData: ChartDataSets[] = [
        { data: [], label: 'Visitors' },
    ]
    lineChartLabels: Label[] = [];

    lineChartOptions = {
        responsive: true,
        spanGaps: true,
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 0
                }
            }]
        }
    }
    lineChartColors: Color[] = [
        {
            borderColor: ' #098dcc',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            pointHoverBackgroundColor: ' #098dcc',
            pointBackgroundColor: ' #098dcc',

        },

    ]

    lineChartLegend = true;
    lineChartPlugins = []
    lineChartType = 'line'

    fetching = true
    visitorFetching = 'inprogress'
    projectCount: any
    totalDownloads = 0
    dateFormat: any
    dashboardData: any
    monthlySalesData: Array<any> = []
    monthlyTotalAmount = 0
    activeMenu='business'
    constructor(
        public api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService
    ) {
        this.dateFormat = cs.DATE_TIME_FORMAT.SHORT_DATE

    }

    ngOnInit() {

        // this.ds.vistorHistory().subscribe((resp: any) => {
        //     if (resp.success == true) {

        //         for (let i = 6; i >= 0; i--) {
        //             this.lineChartLabels.push('' + moment(this.todayDate).subtract(i, 'day').format(this.dateFormat));
        //         }

        //         this.lineChartData = [
        //             { data: resp.data.visitors_report, label: 'Visitors', fill: false, pointBorderWidth: 10, }
        //         ]
        //         this.visitorFetching = 'done'
        //     }
        // })
        // this.ds.dashboardData().subscribe((resp: any) => {
        //     if (resp.success == true) {
        //         this.dashboardData = resp.data
        //         this.projectCount = resp.data.project_downloads
        //         this.fetching = false
        //         this.projectCount.forEach((d: any) => {
        //             this.totalDownloads += d.project_downloads[0].downloads_count
        //         })

        //         // visitor histrory

        //         for (let i = 6; i >= 0; i--) {
        //             this.lineChartLabels.push('' + moment(this.todayDate).subtract(i, 'day').format(this.dateFormat));
        //         }

        //         this.lineChartData = [
        //             { data: resp.data.visitors_report, label: 'Visitors', fill: false, pointBorderWidth: 10, }
        //         ]
        //         this.visitorFetching = 'done'
        //     }
        // })
    }
    getReport() {
        if (this.month == '') {
            this.alert.error('Please Choose Month')

            return false
        }
        if (this.year == null) {
            this.alert.error('Please Choose Year')

            return false
        }
        if (this.year > moment().year()) {
            this.alert.error('Year cant be greater then current year')

            return false
        }
        const params = {
            month: this.month,
            year: this.year

        }
        // this.ds.salesPerMonth(params).subscribe((resp: any) => {
        //     if (resp.success == true) {
        //         this.monthlySalesData = resp.data
        //         if (this.monthlySalesData.length > 0) {
        //             this.monthlySalesData.forEach((d: any) => {
        //                 this.monthlyTotalAmount += d.amount
        //             })
        //         } else {
        //             this.monthlyTotalAmount = 0
        //         }

        //         this.alert.success('Report Generated Successfully')
        //     } else {
        //         this.alert.error(resp.errors.general)
        //     }
        // })
    }
    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }
}
