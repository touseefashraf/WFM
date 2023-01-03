import { ApiService } from './../../../services/api.service';
import { apis } from './../../../../environments/environment.prod';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'

@Component({
    selector: 'app-attendance-requests',
    templateUrl: './attendance-requests.component.html',
    styleUrls: ['./attendance-requests.component.css']
})
export class AttendanceRequestsComponent implements OnInit {
    attendanceRrequestsList: any = []
    attendanceRrequestsForm: FormGroup
    dataStatus = 'fetching'
    selectedId: any
    selectedIndex: any
    modalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        public alert: IAlertService,
        private ms: BsModalService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        public api:ApiService
    ) {
        this.attendanceRrequestsForm = this.fb.group({
            reject_reason: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
        })

        this.ds.getAttendanceRequests().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.attendanceRrequestsList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    ngOnInit() {
    }

    get g() {
        return this.attendanceRrequestsForm.controls
    }

    approveRequestConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    rejectRequestConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    acceptRequest() {
        this.loginLoading = true
        const param = {
            request_id: this.selectedId
        }
        this.ds.acceptRequest(param).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.error.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Request Accepted successfully')
                this.attendanceRrequestsList[this.selectedIndex].approval_status = 'approved'
                // this.attendanceRrequestsList.splice(this.selectedIndex, 1)
            }
            this.modalRef.hide()
        })
    }

    rejectRequest() {
        this.loginLoading = true
        if (this.attendanceRrequestsForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in field & try again.')
            this.loginLoading = false

            return false
        }
        const param = {
            request_id: this.selectedId,
            reject_reason: this.attendanceRrequestsForm.value.reject_reason,
        }
        this.ds.rejectRequest(param).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.error.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Request Rejected successfully')
                this.attendanceRrequestsList[this.selectedIndex].approval_status = 'rejected'
            }
            this.modalRef.hide()
        })
    }

    getStatusFormat(status: string) {
        const statusFormat = {
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
        }

        return statusFormat[status]
    }

    getStatusClass(status: string) {
        const statusFormat = {
            pending: 'i-badge sm yellow',
            approved: 'i-badge sm blue',
            rejected: 'i-badge sm red',
        }

        return statusFormat[status]
    }

}
