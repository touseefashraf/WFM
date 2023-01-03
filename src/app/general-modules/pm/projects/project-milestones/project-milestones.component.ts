import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from '../data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { BsModalService } from 'ngx-bootstrap/modal'

@Component({
    selector: 'app-project-milestones',
    templateUrl: './project-milestones.component.html',
    styleUrls: ['./project-milestones.component.css']
})
export class ProjectMilestonesComponent implements OnInit {
    projectMileStoneList = []
    projectPaymentDetailList = []
    projectDetail: any
    dataStatus = 'fetching'
    dataStatusDetail = 'fetching'
    mileStoneForm: FormGroup
    projectPaymentForm: FormGroup
    projectId: any
    projectMilestoneId: any
    forPaymentDetailId: any
    selectedIndex: any
    selectedId: any
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 8,
        colSpans: {
            0: 1,
        }
    }
    loaderOptionsPayment = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }
    modalRef: any

    constructor(
        private dataService: DataService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public api: ApiService,
        public ui: UIHelpers,
        private ms: BsModalService,
    ) {
        this.projectId = this.route.snapshot.queryParamMap.get('id')

        this.mileStoneForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            status: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required,]),
            fee_amount: new FormControl(null, [Validators.required]),
        })

        this.projectPaymentForm = this.fb.group({
            conversion_rate: new FormControl(null, [Validators.required]),
            released_amount: new FormControl(null, [Validators.required]),
            released_amount_pkr: new FormControl(null, [Validators.required]),
            fee_amount: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit() {
        this.dataService.getProjectDetails(this.projectId).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.error.general)
            }

            if (resp.success === true) {
                this.projectDetail = resp.data
            }
        })

        this.dataService.getProjectMileStonesList(this.projectId).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.error.general)
            }

            if (resp.success === true) {
                console.log(resp.data)
                this.projectMileStoneList = resp.data
                this.dataStatus = 'done'
            }
        })

        this.mileStoneForm.controls.amount.valueChanges.subscribe((amount: number) => {
            const fee = amount * this.projectDetail.fee_percentage / 100
            this.mileStoneForm.controls.fee_amount.setValue(fee)
        })

        this.projectPaymentForm.controls.released_amount_pkr.valueChanges.subscribe((pkrAmount: number) => {
            const ra: number = +this.projectPaymentForm.controls.released_amount.value - +this.projectPaymentForm.controls.fee_amount.value
            const cr: number = ra > pkrAmount ? ra / pkrAmount : pkrAmount / ra
            this.projectPaymentForm.controls.conversion_rate.setValue(cr, { emitEvent: false })
            console.log('released_amount_pkr', cr)
        })

        this.projectPaymentForm.controls.released_amount.valueChanges.subscribe((releasedAmount: number) => {
            console.log('released_amount', releasedAmount)

            const feeAmount = releasedAmount * this.projectMileStoneList[this.selectedIndex].project.fee_percentage / 100
            this.projectPaymentForm.controls.fee_amount.setValue(feeAmount, { emitEvent: false })

            const pkrAmount = (releasedAmount - feeAmount) * this.projectPaymentForm.controls.conversion_rate.value
            this.projectPaymentForm.controls.released_amount_pkr.setValue(pkrAmount, { emitEvent: false })
        })

        this.projectPaymentForm.controls.fee_amount.valueChanges.subscribe((feeAmount: number) => {
            const pkrAmount = (this.projectPaymentForm.controls.released_amount.value - feeAmount) * this.projectPaymentForm.controls.conversion_rate.value
            this.projectPaymentForm.controls.released_amount_pkr.setValue(pkrAmount, { emitEvent: false })
        })

        this.projectPaymentForm.controls.conversion_rate.valueChanges.subscribe((conversionRate: number) => {
            const pkrAmount = (this.projectPaymentForm.controls.released_amount.value - this.projectPaymentForm.controls.fee_amount.value) * conversionRate
            this.projectPaymentForm.controls.released_amount_pkr.setValue(pkrAmount, { emitEvent: false })
            console.log('conversion_rate')
        })
    }

    get g() {
        return this.mileStoneForm.controls
    }

    get p() {
        return this.projectPaymentForm.controls
    }

    openModalSubject(mileStoneModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.mileStoneForm.patchValue(this.projectMileStoneList[index])
        }
        this.modalRef = this.ms.show(
            mileStoneModal,
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
        if (this.mileStoneForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.mileStoneForm.value.id,
            project_id: this.projectId,
            title: this.mileStoneForm.value.title,
            status: this.mileStoneForm.value.status,
            amount: this.mileStoneForm.value.amount,
            fee_amount: this.mileStoneForm.value.fee_amount,
        }

        let saveUpdate = this.dataService.addMileStone(params)
        if (this.mileStoneForm.value.id !== null) {
            saveUpdate = this.dataService.updateMileStone(params)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.mileStoneForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    const index = this.projectMileStoneList.findIndex((milestone: any) => {
                        return milestone.id === this.mileStoneForm.value.id
                    })
                    console.log('Index', index)

                    this.projectMileStoneList[index] = resp.data

                } else {
                    this.projectMileStoneList.push(resp.data)
                    this.alert.success('MileStone added successfully!!')
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    openModalProjectPayment(projectPaymentModal, index) {
        this.selectedIndex = index
        this.projectMilestoneId = this.projectMileStoneList[index].id
        const releaseAmount = this.projectMileStoneList[index].amount - this.projectMileStoneList[index].released_amount - this.projectMileStoneList[index].fee_amount
        const feeAmount = releaseAmount * this.projectMileStoneList[index].project.fee_percentage / 100
        const releasableAmount = releaseAmount - feeAmount
        const conversionRate = this.projectMileStoneList[index].project.currency.conversion_rate

        this.projectPaymentForm.controls.released_amount.setValidators([Validators.required, Validators.max(releaseAmount)])
        this.projectPaymentForm.controls.conversion_rate.setValue(conversionRate)
        this.projectPaymentForm.controls.fee_amount.setValue(feeAmount)
        this.projectPaymentForm.controls.released_amount.setValue(releaseAmount)
        this.projectPaymentForm.controls.released_amount_pkr.setValue(releasableAmount * conversionRate)

        this.modalRef = this.ms.show(
            projectPaymentModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveProjectPayment(f: any) {
        this.loginLoading = true
        if (this.projectPaymentForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            released_amount: this.projectPaymentForm.value.released_amount,
            released_amount_pkr: this.projectPaymentForm.value.released_amount_pkr,
            fee_amount: this.projectPaymentForm.value.fee_amount,
            exchange_rate: this.projectPaymentForm.value.conversion_rate,
            project_id: this.projectId,
            project_milestone_id: this.projectMilestoneId
        }

        this.dataService.addProjectPayment(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                console.log('addedProjectPayment', resp.data)
                this.projectMileStoneList[this.selectedIndex].released_amount = +this.projectMileStoneList[this.selectedIndex].released_amount + +this.projectPaymentForm.controls.released_amount.value
                this.alert.success('Project Payment added successfully!!')
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    openModalPaymentDetail(paymentDetailModal, index) {
        this.dataStatusDetail = 'fetching'
        this.forPaymentDetailId = this.projectMileStoneList[index].id

        this.dataService.getPaymentDetailList(this.forPaymentDetailId).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.error.general)
            }

            if (resp.success === true) {
                this.projectPaymentDetailList = resp.data
                this.dataStatusDetail = 'done'
            }
        })

        this.modalRef = this.ms.show(
            paymentDetailModal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.dataService.deleteMileStone(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                this.loginLoading = false

                return false
            } else {
                const deletingIndex = this.projectMileStoneList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.projectMileStoneList.splice(deletingIndex, 1)
                this.modalRef.hide()
                this.alert.success('MileStone deleted successfully!!')
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    getStatusFormat(status: string) {
        const statusFormat = {
            funded: 'Funded',
            not_funded: 'Not Funded',
            released: 'Released',
            partially_released: 'Partially Released',
        }

        return statusFormat[status]
    }

    getStatusClass(status: string) {
        const statusFormat = {
            funded: 'sm i-badge blue',
            not_funded: 'sm i-badge red',
            released: 'sm i-badge green',
            partially_released: 'sm i-badge yellow',
        }

        return statusFormat[status]
    }

    goToBack() {
        this.router.navigate(['admin/projects/projects-document'], { queryParams: { id: this.projectId }, replaceUrl: true })
    }

    goToNext() {
        this.router.navigate(['admin/projects/project-credentials'], { queryParams: { id: this.projectId }, replaceUrl: true })
    }
}
