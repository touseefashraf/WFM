import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service'
import { Component, OnInit } from '@angular/core'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'
import { Label } from 'ng2-charts'
import * as moment from 'moment';

@Component({
    selector: 'app-financial-stats',
    templateUrl: './financial-stats.component.html',
    styleUrls: ['./financial-stats.component.css']
})
export class FinancialStatsComponent implements OnInit {
    fromMonthYear = moment().subtract(1, 'months').subtract(1, 'years').toDate()
    toMonthYear = moment().subtract(1, 'months').toDate()
    months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }
    barChartOptions: ChartOptions = {
        responsive: true,
    }
    barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
    barChartType: ChartType = 'bar'
    barChartLegend = true
    barChartPlugins = []

    barChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Income' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Expense' },
        { data: [90000000, 90000000, 90000000, 90000000, 90000000, 33333, 40], label: 'Employee Salery' },
    ]
    financialStatsList: any = []
    dataStatus = false
    loginLoading = false
    constructor(
        public ds: DataService,
        public alert: IAlertService
    ) {
        this.search()
    }
    search() {
        this.loginLoading = true
        let filtersParam: any = {}

        filtersParam = {
            from_month: this.fromMonthYear.getMonth() + 1,
            from_year: this.fromMonthYear.getFullYear(),
            to_month: this.toMonthYear.getMonth() + 1,
            to_year: this.toMonthYear.getFullYear(),
        }

        if (filtersParam.from_year == null || filtersParam.to_year == null) {
            this.alert.error('From Year/To Year cant be empty')
            this.loginLoading = false

            return false
        }
        if (filtersParam.from_year > filtersParam.to_year) {
            this.alert.error('From Year can,t be greater then To Year')
            this.loginLoading = false

            return false
        }
        if ((filtersParam.from_year == filtersParam.to_year) && (+filtersParam.from_month > +filtersParam.to_month)) {
            this.alert.error('From Month cat be greater then To Month If From/To Years are same')
            this.loginLoading = false

            return false
        }
        this.ds.getFinancialStats(filtersParam).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success == true) {
                this.financialStatsList = resp.data
                this.dataStatus = true
                // Add labels
                this.barChartLabels = []
                let index = 0
                let propertyName = ''
                if (this.financialStatsList.expenses.length > index) {
                    index = this.financialStatsList.expenses.length
                    propertyName = 'expenses'
                }
                if (this.financialStatsList.income.length > index) {
                    index = this.financialStatsList.income.length
                    propertyName = 'income'
                }
                if (this.financialStatsList.employeeSalaries.length > index) {
                    index = this.financialStatsList.employeeSalaries.length
                    propertyName = 'employeeSalaries'
                }

                this.financialStatsList[propertyName].forEach(d => {
                    this.barChartLabels.push(`${this.months[d.month]} ${d.year}`)
                })
                // Add labels end

                // add data
                this.barChartData[0].data = []
                this.barChartData[1].data = []
                this.barChartData[2].data = []
                this.financialStatsList.income.forEach(d => {
                    this.barChartData[0].data.push(d.amount)
                })
                this.financialStatsList.expenses.forEach(d => {
                    this.barChartData[1].data.push(d.amount)
                })
                this.financialStatsList.employeeSalaries.forEach(d => {
                    this.barChartData[2].data.push(d.amount)
                })
                // add data ends
            }
        })
    }
    ngOnInit() {
        console.log('FROM ', this.fromMonthYear, ' TO ', this.toMonthYear)
    }

}
