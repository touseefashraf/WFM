import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { DataService } from '../data.service'
import { Component, OnInit } from '@angular/core'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'
import { Label } from 'ng2-charts'
import * as moment from 'moment'
@Component({
    selector: 'app-business-development-dashboard',
    templateUrl: './business-development-dashboard.component.html',
    styleUrls: ['./business-development-dashboard.component.css']
})
export class BusinessDevelopmentDashboardComponent implements OnInit {
    moment = moment
    filters = {
        from_month: '11',
        from_year: 2020,
        to_month: '11',
        to_year: 2021
    }
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
    data: any = []
    dataVaStatus= false
    leadLollowups:any=[]

    constructor(
        public ds: DataService,
        public alert: IAlertService
    ) {

        this.ds.activeMenu = 'business'

        this.ds.getBDMstate().subscribe((resp: any) => {
            if (resp.success === true) {

                this.data = resp.data
                this.leadLollowups = resp.data.lead_followups
                this.dataVaStatus = true

            }

        })

        this.ds.getFinancialStats(this.filters).subscribe((resp: any) => {
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
    }

}
