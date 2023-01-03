import { ApiService } from 'src/app/services/api.service';
import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'

@Component({
    selector: 'app-banks',
    templateUrl: './banks.component.html',
    styleUrls: ['./banks.component.css']
})
export class BanksComponent implements OnInit {
    dataStatus = false
    bankList = []
    bankForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    loginLoading = false

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api:ApiService
    ) {
        this.bankForm = this.fb.group({
            id: new FormControl(null),
            full_name: new FormControl(null, [Validators.required]),
            short_name: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit() {
        this.ds.getBanks().subscribe((resp: any) => {
            if (resp.success === true) {
                this.bankList = resp.data
                this.dataStatus = true
            }
        })
    }

    get g() {
        return this.bankForm.controls
    }

    openModalBank(bankModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.bankForm.controls.id.setValue(this.bankList[index].id)
            this.bankForm.patchValue(this.bankList[index])
        }
        this.modalRef = this.ms.show(
            bankModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveBank(data: any, f: any) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        let saveUpdate = this.ds.addBank(data.value)
        if (this.bankForm.value.id !== null) {
            saveUpdate = this.ds.updateBank(data.value)
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()
                this.loginLoading = false

                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.bankList[this.selectedIndex] = data.value
                } else {
                    data.value.id = resp.data
                    this.alert.success('Bank added successfully!!')
                    this.bankList.push(data.value)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteBank() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.ds.deleteBank(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading = false

                    return false
                } else {
                    const deletingIndex = this.bankList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.bankList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Bank deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelBankButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }


}
