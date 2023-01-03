import { ActivatedRoute, Router } from '@angular/router';
import { IAlertService } from './../../../libs/ialert/ialerts.service';
import { UIHelpers } from './../../../helpers/ui-helpers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

    dataStatus = 'fetching'
    bankList = []
    accounts = []
    selectedIndex = -1
    accountForm: FormGroup
    modalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 3,
        cols: 7,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router,
        public cs: ConstantsService
    ) {

        const getBankList = this.ds.getBankList()
        getBankList.subscribe((resp: any) => {
            if (resp.success === true) {
                this.bankList = resp.data
            }
        })
        const getAccountList = this.ds.getAccountList()
        getAccountList.subscribe((resp: any) => {
            if (resp.success === true) {
                this.accounts = resp.data
                this.dataStatus = 'done'
            }
        })

        // Set Leads Form fields
        this.accountForm = this.fb.group({
            id: new FormControl(null),
            bank_id: new FormControl(null, [Validators.required]),
            title: new FormControl(null, [Validators.required]),
            type: new FormControl(null, [Validators.required]),
            account_no: new FormControl(null, [Validators.required]),
            branch_code: new FormControl(null, [Validators.required])
        })


    }
    get g() {
        return this.accountForm.controls
    }
    ngOnInit() {
    }

    openModal(modal, index) {

        if (index > -1) {

            this.accountForm.controls.id.setValue(this.accounts[index].id)
            this.accountForm.patchValue(this.accounts[index])
        }

        this.selectedIndex = index

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

    confirmingModal(template: TemplateRef<any>, i: any) {
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    save(f: any) {
        this.loginLoading = true
        if (this.accountForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false
            return false
        }
        let saveUpdate = this.ds.add(this.accountForm.value)

        if (this.accountForm.value.id !== null) {
            saveUpdate = this.ds.update(this.accountForm.value)
        }
        saveUpdate.subscribe((resp: any) => {

            this.loginLoading = false

            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.accounts[this.selectedIndex] = resp.data
                    this.selectedIndex = -1

                } else {
                    this.alert.success('Lead added successfully!!')
                    this.accounts.push(resp.data)
                }
                this.modalRef.hide()
                f.resetForm()
            }
        })

    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.accounts[this.selectedIndex].id
        }
        const deleteEntry = this.ds.delete(params)
        deleteEntry.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.accounts.splice(this.selectedIndex, 1)
                this.alert.success('Lead Entry Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }


    cancelButton(f: any) {
        if (f) {
            f.resetForm()
        }
        this.modalRef.hide()
    }

}
