import { ApiService } from './../../../services/api.service';
import { DataService } from './data.service';
import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ConstantsService } from 'src/app/services/constants.service'
@Component({
    selector: 'app-attendance-correction',
    templateUrl: './attendance-correction.component.html',
    styleUrls: ['./attendance-correction.component.css']
})
export class AttendanceCorrectionComponent implements OnInit {

    dataStatus = ''
    planForm: FormGroup
    moment = moment
    recentRequests: any = []
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 3,
        colSpans: {
            0: 1,
        }
    }
    selectedId = -1
    modalRef: BsModalRef
    requests: any = []
    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public cs: ConstantsService,
        public ms: BsModalService,
        public api:ApiService
    ) {

        this.getMyRequests()

        this.planForm = this.fb.group({
            date: new FormControl(null, [Validators.required]),
            checkin: new FormControl(null, [Validators.required]),
            checkout: new FormControl(null, [Validators.required]),
            description: new FormControl(null)
        })
    }

    getMyRequests() {

        this.dataStatus = 'featching'
        const myRequests = this.ds.getMyAttandanceRequests()
        myRequests.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.dataStatus = 'done'
                this.recentRequests = resp.data
            }

        })
    }


    openModal(modalTemplate) {

        this.modalRef = this.ms.show(
            modalTemplate,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )

    }
    saveRequests(f: any) {
        this.loginLoading = true
        if (this.planForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        const dated = moment(this.planForm.value.date).format('YYYY-MM-DD ')
        const params = {
            checkin: moment(this.planForm.value.checkout).format(dated + 'H:mm'),
            checkout: moment(this.planForm.value.checkin).format(dated + 'H:mm'),
            description: this.planForm.value.description,
        }

        const addRequests = this.ds.addNewRequests(params)
        addRequests.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.recentRequests.push(resp.data)
                this.alert.success('Requested added successfully!!')

            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            request_id: this.selectedId
        }
        const addRequests = this.ds.deleteRequests(params)
        addRequests.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.getMyRequests()
                this.alert.success('Entry Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
    cancelButtonNon() {
        this.modalRef.hide()
    }
    get g() {
        return this.planForm.controls
    }

    ngOnInit() {
    }
}
