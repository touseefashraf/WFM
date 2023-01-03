import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from './../../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../../helpers/ui-helpers'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from '../data.service'
import { Component, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-lead-details',
    templateUrl: './lead-details.component.html',
    styleUrls: ['./lead-details.component.css']
})
export class LeadDetailsComponent implements OnInit {

    id: any
    dataStatus = ''
    followForm: FormGroup
    selectedIndex = -1
    lead: any = []
    moment = moment

    followUpStatuses: any
    modalRef: BsModalRef
    leadDetails: any = []
    loaderOptions = {
        rows: 3,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }
    loginLoading = false
    titleOfModal = 'Add Lead Follow up';
    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        public api: ApiService,
        private router: Router,
        public cs: ConstantsService
    ) {
        this.followUpStatuses = this.cs.FOLLOWUP_STATUSES
        console.log(this.followUpStatuses)

        this.id = this.route.snapshot.params.id

        this.followForm = this.fb.group({
            id: new FormControl(null),
            lead_id: new FormControl(this.id),
            title: new FormControl(null, [Validators.required]),
            status: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
            followup_date: new FormControl(null, [Validators.required]),
            response: new FormControl(null, [Validators.required])
        })


    }

    ngOnInit() {

        this.getLeadDetails()
    }
    get c() {
        return this.followForm.controls
    }
    getLeadDetails() {
        this.dataStatus = 'fetching'
        const params = { lead_id: this.id }

        const leadDetails = this.ds.getLeadDetails(params)
        leadDetails.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.dataStatus = 'done'
                if (resp.data) {
                    this.leadDetails = resp.data
                    console.log(this.leadDetails)
                }
            }
        })


    }
    getStatusFormat(status: string) {
        const statusFormat = {
            pending: 'Pending',
            triggered: 'Triggered',
            done: 'Done'
        }

        return statusFormat[status]
    }
    getStatusClass(status: string) {
        const statusFormat = {
            pending: 'sm i-badge yellow',
            done: 'sm i-badge green',
            triggered: 'sm i-badge blue'
        }

        return statusFormat[status]
    }
    openModalFollowUp(modal, index) {
        this.titleOfModal = 'Add Follow-up'
        if (index > -1) {
            this.followForm.patchValue(this.leadDetails.lead_followups[index])
            this.followForm.controls.followup_date.setValue(new Date(this.leadDetails.lead_followups[index].followup_date))
            this.selectedIndex = index
            this.titleOfModal = 'Edit Follow-up'
        }
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )

    }
    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.leadDetails.lead_followups[this.selectedIndex].id
        }
        const dellFolloup = this.ds.deleteLeadFollowup(params)
        dellFolloup.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {

                this.leadDetails.lead_followups.splice(this.selectedIndex, 1)

                this.alert.success('Lead Follow-up Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }

    save(f: any) {
        this.loginLoading = true
        if (this.followForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = this.followForm.value
        params.followup_date = moment(params.followup_date).format('YYYY-MM-DD H:mm')
        params.lead_id = this.id


        let save = this.ds.addFollowup(params)

        if (params.id !== null) {
            save = this.ds.updateFollowForm(params)
        }
        save.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {

                if (params.id !== null) {

                    this.leadDetails.lead_followups[this.selectedIndex] = resp.data
                    this.selectedIndex = -1

                } else {
                    this.leadDetails.lead_followups.push(resp.data)
                }

            }
            this.modalRef.hide()
            f.resetForm()
        })

    }


    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
    cancelButtonNon() {

        this.modalRef.hide()
    }
}
