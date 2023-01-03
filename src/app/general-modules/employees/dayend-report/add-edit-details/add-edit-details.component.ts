import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from '../data.service'
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service'

@Component({
    selector: 'app-add-edit-details',
    templateUrl: './add-edit-details.component.html',
    styleUrls: ['./add-edit-details.component.css']
})
export class AddEditDetailsComponent implements OnInit {
    reportDetails: any
    dataStatus = false
    projectList = []
    dataToSend = {
        dayend_report_id: null,
        work_summary: '',
        date: null,
        dayend_report_detail: []
    }
    editorConfig: any = ConstantsService.EDITOR_CONFIG
    loginLoading = false
    constructor(
        private ds: DataService,
        public ui: UIHelpers,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router,
        public api: ApiService
    ) {
        this.ds.getProjectList().subscribe((resp: any) => {
            if (resp.success == true) {
                this.projectList = resp.data
            }
        })
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.dataToSend.dayend_report_id = params.id
                this.initializeReport()
            } else {
                this.dataStatus = true
            }
        })
    }

    initializeReport() {
        this.ds.getReportDetails({ id: this.dataToSend.dayend_report_id }).subscribe((resp: any) => {
            if (resp.success == true) {
                this.reportDetails = resp.data
                this.dataToSend = {
                    dayend_report_id: this.dataToSend.dayend_report_id,
                    work_summary: this.reportDetails.work_summary,
                    date: moment(this.reportDetails.date).format('MMMM Do YYYY'),
                    dayend_report_detail: this.reportDetails.dayend_report_details
                }
                this.dataStatus = true
            }
        })
    }
    addReportRow() {
        this.dataToSend.dayend_report_detail.push({
            id: null,
            summary: '',
            task_ref: '',
            github_link: '',
            project_id: null,
            hours: 0,
        })
    }
    save() {
        this.loginLoading = true
        console.log('data', this.dataToSend)
        if (this.dataToSend.work_summary == '') {
            this.alert.error('Work summary is required')
            this.loginLoading = false

            return false
        }
        if (this.dataToSend.date == null) {
            this.alert.error('Date is required')
            this.loginLoading = false

            return false
        }
        if (this.dataToSend.dayend_report_detail.length == 0) {
            this.alert.error('Please add atleast one report detail')
            this.loginLoading = false

            return false
        }
        let totalHours = 0
        this.dataToSend.dayend_report_detail.forEach((resp: any) => {
            totalHours = totalHours + resp.hours
        })
        if (totalHours < 8) {
            this.alert.error('Total Hours must be atleast 8 Hours')
            this.loginLoading = false

            return false
        }
        if (this.dataToSend.dayend_report_id !== null) {
            this.dataToSend.date = moment(this.reportDetails.date).format('YYYY-MM-DD')
        } else {
            this.dataToSend.date = moment(this.dataToSend.date).format('YYYY-MM-DD')
        }
        this.ds.saveDetails(this.dataToSend).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success == true) {
                if (this.dataToSend.dayend_report_id !== null) {
                    this.alert.success('details updated successfully')
                    this.dataToSend.dayend_report_detail = resp.data.dayend_report_details
                } else {
                    this.alert.success('details Added successfully')
                    this.router.navigate(['/admin/dayend-report/edit'], { queryParams: { id: resp.data.id }, replaceUrl: true })
                }
            } else {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            }
        })

    }
    deleteRow(index) {
        if (this.dataToSend.dayend_report_detail[index].id !== null) {
            this.ds.deleteReportDetail({ id: this.dataToSend.dayend_report_detail[index].id }).subscribe((resp: any) => {
                if (resp.success == true) {
                    this.alert.success('Task deleted Successfully')
                    this.dataToSend.dayend_report_detail.splice(index, 1)
                } else {
                    this.alert.error(resp.errors.general)
                }
            })
        } else {
            this.dataToSend.dayend_report_detail.splice(index, 1)
        }
    }
    ngOnInit() {
    }

}
