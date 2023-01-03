import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
@Component({
    selector: 'app-my-leave-request',
    templateUrl: './my-leave-request.component.html',
    styleUrls: ['./my-leave-request.component.css']
})
export class MyLeaveRequestComponent implements OnInit {

    dataStatus = 'fetching'
    thumbnail: any = '/assets/img/default.png'
    spinnerSVG = `/assets/images/spinner.svg`
    deletePop: any
    formData: FormGroup
    dataList = []
    selectedIndex: any
    selectedId: any
    modalRef: BsModalRef
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }
    pagination: any
    startDate: any = ''
    endDate: any = ''
    filters: any = {
        page: 1
    }
    minDate = new Date();
    constructor(
        private ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public router: Router,
        private route: ActivatedRoute,
    ) {
        this.formData = this.fb.group({
            id: new FormControl(null),
            description: new FormControl(null, [Validators.maxLength(1000)]),
            start_date: new FormControl(null, [Validators.required]),
            end_date: new FormControl(null, [Validators.required]),
            leave_days: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.search()
    }
    setPagination(page: number) {
        this.filters.page = page
        this.search()
    }

    search() {
        this.loginLoading = true
        this.dataStatus = 'fetching'
        const params = {
            page: this.filters.page,
        }
       
        this.ds.get(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.dataList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/my-leave-requests'], { queryParams: params, replaceUrl: true })
            }
        })
    }
    get g() {
        return this.formData.controls
    }
    getDays(e, type) {
        if (type == 'start') {
            this.startDate = e
        } else {
            this.endDate = e
        }

        if (this.startDate && this.endDate) {
            const days = (moment(this.endDate)).diff(moment(this.startDate), 'days') + 1
            this.formData.controls.leave_days.setValue(days)
        }
    }
    openModalSubject(adderModal, index) {
        this.modalRef = this.ms.show(
            adderModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    save(f: any) {
        this.loginLoading = true
        if (this.formData.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        if ((moment(this.formData.value.start_date)).diff(moment(this.formData.value.end_date)) > 0) {
            this.alert.error('Year Start Date can not be greater than End Date..')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.formData.value.id,
            title: this.formData.value.title,
            description: this.formData.value.description,
            leave_days: this.formData.value.leave_days,
            start_date: moment(this.formData.value.start_date).format('YYYY-MM-DD').toString(),
            end_date: moment(this.formData.value.end_date).format('YYYY-MM-DD').toString(),
            approval_status: 'pending'
        }

        this.ds.addLeaveRequest(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                params.id = resp.data
                this.alert.success('Request added successfully!!')
                
                this.dataList.push(params)
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    delete() {
        this.loginLoading = true
        const params = {
            request_id: this.selectedId
        }
        this.ds.delete(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading = false

                    return false
                } else {
                    const deletingIndex = this.dataList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.dataList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('deleted successfully!!')
                    this.selectedIndex = -1
                }
            })
    }
}
