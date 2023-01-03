import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

    dataStatus = 'fetching'
    deletePop: any
    addEditForm: FormGroup
    dbData = []
    selectedIndex: any
    selectedId: any
    modalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }
    constructor(
        private ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.addEditForm = this.fb.group({
            id: new FormControl(null),
            full_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            short_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            country: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            conversion_rate: new FormControl(null, [Validators.required, Validators.maxLength(7)]),

        })
    }

    ngOnInit() {

        this.ds.getCurrency().subscribe((resp: any) => {
            if (resp.success === true) {
                this.dbData = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.addEditForm.controls
    }

    openModal(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.addEditForm.patchValue(this.dbData[index])
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

    save(f: any) {
        this.loginLoading = true
        if (this.addEditForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        // const params = {
        //     id: this.addEditForm.value.id,
        //     full_name: this.addEditForm.value.full_name,
        //     short_name: this.addEditForm.value.short_name,
        //     country: this.addEditForm.value.country,
        //     conversion_rate: this.addEditForm.value.conversion_rate,
        // }

        let saveUpdate = this.ds.addCurrency(this.addEditForm.value)
        if (this.addEditForm.value.id !== null) {
            saveUpdate = this.ds.updateCurrency(this.addEditForm.value)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.dbData[this.selectedIndex] = this.addEditForm.value

                } else {
                    this.addEditForm.value.id = resp.data
                    this.alert.success('Currency added successfully!!')
                    this.dbData.push(this.addEditForm.value)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.ds.deleteCurrency(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.deletePop.hide()
                    this.loginLoading = false

                    return false
                } else {
                    this.dbData.splice(this.selectedIndex, 1)
                    this.deletePop.hide()
                    this.alert.success('Currency deleted successfully!!')
                }
            })
    }

    cancelButton(f: any) {
        f.resetForm()
        console.log('Form is Reset Now')
        this.modalRef.hide()
    }

}
