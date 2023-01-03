import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit, ɵConsole } from '@angular/core'
import { DataService } from './data.service'

@Component({
    selector: 'app-project-financial-report',
    templateUrl: './project-financial-report.component.html',
    styleUrls: ['./project-financial-report.component.css']
})
export class ProjectFinancialReportComponent implements OnInit {

    dataStatus = false
    projectList = []
    projectId = null
    projectInfo: any = null
    employListDetails = []
    financialDetails = []
    netTotalCost = 0
    totalHours = 0
    amountNotFunded = 0
    amountFunded = 0
    totalReleasedAmount = 0
    currency = ''
    currencyRate = 0
    releasedAmountPKR = 0
    projectPayments: any = null
    loginLoading = false
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private alert: IAlertService,
        public ds: DataService
    ) {
        this.ds.getProjectList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.projectList = resp.data
                console.log(this.projectList)

                this.dataStatus = true
            }
        })

    }

    ngOnInit() {


    }
    searchDetails() {
        this.loginLoading = true
        if (this.projectId === null || this.projectId === 'null') {
            this.alert.error('Please select a project and continue.')
            this.loginLoading = false

            return false
        }
        const params = {
            project_id: this.projectId
        }
        this.ds.searchProjecDetails(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === true) {
                this.financialDetails = resp.data.hours_details
                this.projectInfo = resp.data
                console.log(this.projectInfo)

                this.netTotalCost = 0
                this.totalHours = 0
                this.totalReleasedAmount = 0
                this.amountNotFunded = 0
                this.amountFunded = 0
                this.currency = ''
                this.currencyRate = 0
                this.releasedAmountPKR = 0
                this.financialDetails.forEach(entry => {

                    this.netTotalCost = this.netTotalCost + (entry.hours * entry.hourly_rate)
                    this.totalHours = this.totalHours + +entry.hours

                })


                this.currency = this.projectInfo.project_details.currency.short_name
                this.currencyRate = this.projectInfo.project_details.currency.conversion_rate
                this.projectInfo.project_details.project_milestones.forEach(milestone => {

                    this.totalReleasedAmount = this.totalReleasedAmount + milestone.released_amount

                    if (milestone.status === 'not_funded')
                        this.amountNotFunded = this.amountNotFunded + milestone.amount
                    else
                        this.amountFunded = this.amountFunded + milestone.amount

                })
                this.projectPayments = this.projectInfo.project_details.project_payments
                this.projectPayments.forEach(payments => {

                    this.releasedAmountPKR = this.releasedAmountPKR + payments.released_amount

                })

                console.log(resp.data.hours_details)

                this.dataStatus = true
            }
        })
    }

    getCurrentId(projectId) {
        console.log(projectId)
        this.projectId = projectId
    }
}
