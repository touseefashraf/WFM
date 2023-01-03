import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IAlertService } from './../../../libs/ialert/ialerts.service';
import { UIHelpers } from './../../../helpers/ui-helpers';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core'
import { DataService } from './data.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-income',
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {
    defaultCurrency: any
    dataStatus = 'fetching'
    checkCurrency = false
    readOnly = true
    exchangeRate = 1
    dataList = []
    catList = []
    currencyList = []
    dataForm: FormGroup
    selectedIndex = -1
    modalRef: BsModalRef
    selectedId: any
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }
    loginLoading = false
    pagination: any
    filters: any = {
        page: 1
    }

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api: ApiService,
        private route: ActivatedRoute,
        public router: Router,

    ) {
        const paramSub = this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params) {
                this.search()
            }

        })
        paramSub.unsubscribe()

        this.defaultCurrency = this.api.user.settings.currency

        this.ds.IncomeCategories().subscribe((resp: any) => {
            this.catList = resp.data
        })

        this.ds.getCurrency().subscribe((resp: any) => {
            this.currencyList = resp.data
            console.log(this.currencyList)
        })

        this.dataForm = this.fb.group({
            id: new FormControl(null),
            currency_id: new FormControl(this.defaultCurrency),
            conversionRate: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required]),
            currencyAmount: new FormControl(null, [Validators.required]),
            income_category_id: new FormControl(null, [Validators.required]),
            description: new FormControl(null, []),
        })
    }


    ngOnInit() {
        // this.search()
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

        this.ds.list(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.dataList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/income'], { queryParams: params, replaceUrl: true })
            }
        })
    }

    get g() {
        return this.dataForm.controls
    }

    openModal(amenityModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.dataForm.controls.id.setValue(this.dataList[index].id)
            this.dataForm.patchValue(this.dataList[index])
        } else {
            this.dataForm.controls.currency_id.patchValue(this.defaultCurrency.id)
            this.dataForm.controls.conversionRate.patchValue(this.defaultCurrency.conversion_rate)
        }
        this.modalRef = this.ms.show(
            amenityModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    save(data: any, f: any) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        const params = {
            id: this.dataForm.value.id,
            title: data.value.title,
            description: data.value.description,
            amount: data.value.amount,
            income_category_id: data.value.income_category_id,
            currency_amount: data.value.currencyAmount,
            conversion_rate: data.value.conversionRate,
            currency_id: data.value.currency_id
        }

        let saveUpdate = this.ds.save(params)
        if (this.dataForm.value.id !== null) {
            saveUpdate = this.ds.update(params)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.dataForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.dataList[this.selectedIndex] = params
                    this.dataForm.controls.id.setValue(null)
                } else {
                    this.alert.success('added successfully!!')
                    this.dataList.unshift(resp.data)
                }
            }

            this.checkCurrency = false
            this.modalRef.hide()

            f.resetForm()
        })
    }

    getRate(e) {
        this.checkCurrency = this.defaultCurrency.id != e.target.value
        const index = this.currencyList.findIndex(x => x.id == e.target.value)
        this.exchangeRate = this.currencyList[index].conversion_rate
        this.dataForm.controls.conversionRate.setValue(this.exchangeRate)
        this.dataForm.controls.amount.setValue(this.dataForm.controls.currencyAmount.value * this.exchangeRate)
    }

    changeAmount(e) {
        this.dataForm.controls.amount.setValue(this.dataForm.controls.currencyAmount.value * this.exchangeRate)
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
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

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
        this.selectedIndex = -1
    }

    resetIndex() {
        this.selectedIndex = -1
    }

    updateConversionRate(e) {
        const pkrValue = e.target.value
        const cr = pkrValue < this.dataForm.controls.currencyAmount.value ? this.dataForm.controls.currencyAmount.value / pkrValue : pkrValue / this.dataForm.controls.currencyAmount.value
        this.dataForm.controls.conversionRate.setValue(cr)
    }
}
