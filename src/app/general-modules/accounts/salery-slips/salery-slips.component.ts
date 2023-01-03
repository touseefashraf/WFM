import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from './data.service'
import { ConstantsService } from 'src/app/services/constants.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import * as moment from 'moment'
@Component({
    selector: 'app-salery-slips',
    templateUrl: './salery-slips.component.html',
    styleUrls: ['./salery-slips.component.css']
})
export class SalerySlipsComponent implements OnInit {
    filters = {
        fromMonthYear: moment().subtract(1, 'years').startOf('month').toDate(),
        toMonthYear: moment().toDate(),
        status: null
    }
    dataStatus: any = 'fetching'
    dataForm: FormGroup
    months: any = []
    salaries: any = []
    masterSelected: any = false
    selectedIds: any = []
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 13,
        colSpans: {
            0: 1,
        }
    }
    modalRef: BsModalRef
    partialForm: FormGroup
    bonusForm: FormGroup
    detectionForm: FormGroup
    selectedIndex = -1
    selectedRow: any = []

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public cs: ConstantsService,
        public ms: BsModalService
    ) {
        this.getSalarySlips()
        this.months = this.cs.MONTHSDATA

        this.partialForm = this.fb.group({
            payable_amount: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required])
        })
        this.bonusForm = this.fb.group({
            bonus_amount: new FormControl(null, [Validators.required]),
            bonus_description: new FormControl(null, [Validators.required])
        })
        this.detectionForm = this.fb.group({
            deduction_amount: new FormControl(null, [Validators.required]),
            deduction_description: new FormControl(null, [Validators.required])
        })

    }

    get g() {
        return this.dataForm.controls
    }
    get b() {
        return this.partialForm.controls
    }
    ngOnInit() {
    }

    getSalarySlips() {
        this.loginLoading = true
        this.dataStatus = 'fetching'
        console.log('FROM ', this.filters.fromMonthYear, ' TO ', this.filters.toMonthYear)
        const params = {
            from_month: this.filters.fromMonthYear.getMonth() + 1,
            from_year: this.filters.fromMonthYear.getFullYear(),
            to_month: this.filters.toMonthYear.getMonth() + 1,
            to_year: this.filters.toMonthYear.getFullYear(),
            status: this.filters.status
        }

        const salarySlips = this.ds.getSalarySlips(params)
        salarySlips.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.dataStatus = 'done'
                this.salaries = []
                this.salaries = resp.data
            }

        })
    }

    addRemoveObj(salary_slip_id, amount) {
        const index = this.selectedIds.findIndex(d => d.salary_slip_id === salary_slip_id)

        if (index > -1) {
            this.selectedIds.splice(index, 1)
        } else {
            this.selectedIds.push({ salary_slip_id: salary_slip_id, amount: amount })
        }

    }

    checkAllEvent(e) {

        if (this.masterSelected === false) {
            const temp = []
            this.salaries.forEach(salery => {
                salery.isChecked = true
                temp.push(salery)
                this.addRemoveObj(salery.id, salery.payable_amount)
            })
            this.salaries = temp
            this.masterSelected = true
        } else {
            const temp = []
            this.salaries.forEach(salery => {
                salery.isChecked = false
                this.addRemoveObj(salery.id, salery.payable_amount)
                temp.push(salery)
            })
            this.salaries = temp
            this.masterSelected = false
        }

        return this.masterSelected
    }

    openModal(incSalaryModal, index) {


        if (index > -1) {

            this.selectedIndex = index
            const params = {
                payable_amount: this.salaries[index].payable_amount,
                description: null
            }
            this.partialForm.patchValue(params)
            this.selectedRow = this.salaries[index]
            console.log(this.selectedRow);
        }
        this.modalRef = this.ms.show(
            incSalaryModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    sendSalariesToSelected() {
        this.loginLoading = true
        if (this.selectedIds.length === 0) {
            this.alert.error('Please select records & try again.')
            this.loginLoading = false

            return false
        }

        const sendSalariesb = this.ds.sendSalaries(this.selectedIds)
        sendSalariesb.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.salaries = resp.data
                this.alert.success('Updated Successfully')

            }

        })


    }

    sendPartial(f: any) {
        this.loginLoading = true
        if (this.partialForm.value.payable_amount == 0) {
            this.alert.error('Please Enter a valid Salary Amount.')
            this.loginLoading = false

            return false
        }
        if (this.partialForm.value.payable_amount > this.selectedRow.payable_amount) {
            this.alert.error('Amount should not be greater than the payable amount.')

            return false
        }
        const params = [{
            salary_slip_id: this.selectedRow.id,
            amount: this.partialForm.value.payable_amount,
            description: this.partialForm.value.description,
        }]

        const sendSalaries = this.ds.sendSalaries(params)
        sendSalaries.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.salaries[this.selectedIndex].status = 'partially_paid'
                this.alert.success('Salary Slips Sended Successfully')
                this.modalRef.hide()
                f.resetForm()
            }

        })
    }
    sendBonus(f: any) {
        this.loginLoading = true
        if (this.bonusForm.value.bonus_amount == 0) {
            this.alert.error('Please Enter a valid Amount as Bonus.')
            this.loginLoading = false

            return false
        }
        const params = {
            salary_slip_id: this.selectedRow.id,
            bonus_amount: this.bonusForm.value.bonus_amount,
            bonus_description: this.bonusForm.value.bonus_description,
        }

        const sendBonusc = this.ds.sendBonus(params)
        sendBonusc.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.salaries[this.selectedIndex].payable_amount = resp.data.payable_amount
                this.salaries[this.selectedIndex].bonus_amount = resp.data.bonus_amount
                this.alert.success('Bounes Added Successfully')
                this.modalRef.hide()
                f.resetForm()
            }

        })
    }

    sendDeduction(f: any) {
        this.loginLoading = true
        if (this.detectionForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        if (this.detectionForm.value.payable_amount == 0) {
            this.alert.error('Please Enter a valid Amount as Bonus.')
            this.loginLoading = false

            return false
        }
        const params = {
            salary_slip_id: this.selectedRow.id,
            deduction_amount: this.detectionForm.value.deduction_amount,
            deduction_description: this.detectionForm.value.deduction_description,
        }

        const addDeduction = this.ds.sendDeduction(params)
        addDeduction.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.salaries[this.selectedIndex].payable_amount = resp.data.payable_amount
                this.salaries[this.selectedIndex].deduction_amount = resp.data.deduction_amount

                this.alert.success('Deduction Aded Successfully')
                this.modalRef.hide()
                f.resetForm()
            }

        })
    }


    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
        this.selectedIndex = -1
    }

}
