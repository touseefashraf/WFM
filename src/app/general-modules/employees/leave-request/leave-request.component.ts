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
    selector: 'app-leave-request',
    templateUrl: './leave-request.component.html',
    styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {

    dataStatus = 'fetching'
    thumbnail: any = '/assets/img/default.png'
    spinnerSVG = `/assets/images/spinner.svg`
    deletePop: any
    formData: FormGroup
    rejectForm: FormGroup
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
            request_id: new FormControl(null),
            paid: new FormControl('0', []),
            days_paid: new FormControl('0', [])
        })
        this.rejectForm = this.fb.group({
            request_id: new FormControl(null),
            reject_reason: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
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
                this.router.navigate(['/admin/leave-requests'], { queryParams: params, replaceUrl: true })
            }
        })
    }
    get g() {
        return this.formData.controls
    }
    get r() {
        return this.rejectForm.controls
    }
   
    openModal(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.formData.controls.request_id.setValue(this.dataList[index].id)
            this.formData.patchValue(this.dataList[index])
        }
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
    openModalReject(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.rejectForm.controls.request_id.setValue(this.dataList[index].id)
            this.rejectForm.patchValue(this.dataList[index])
        }
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

    approveRequest(f: any) {
        this.loginLoading = true
        if (this.formData.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        if ((this.formData.value.paid==1) && this.formData.value.days_paid <= 0) {
            this.alert.error('Paid days should be greater than Zero')
            this.loginLoading = false

            return false
        }
        
        const params = {
            request_id: this.formData.value.request_id,
            paid: this.formData.value.paid,
            days_paid: this.formData.value.days_paid
        }

        this.ds.acceptRequest(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.dataList[this.selectedIndex].approval_status = 'approved'
                this.alert.success('Request Approved successfully!!')
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }
    rejectRequest(f: any) {
        this.loginLoading = true
        if (this.rejectForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        
        const params = {
            request_id: this.rejectForm.value.request_id,
            paid: this.rejectForm.value.paid,
            days_paid: this.rejectForm.value.days_paid
        }

        this.ds.rejectRequest(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.dataList[this.selectedIndex].approval_status = 'rejected'
                this.alert.success('Request Rejected successfully!!')
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }
}
