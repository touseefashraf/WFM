import { ApiService } from './../../../services/api.service';
import { apis } from './../../../../environments/environment.prod';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-increment-types',
    templateUrl: './increment-types.component.html',
    styleUrls: ['./increment-types.component.css']
})
export class IncrementTypesComponent implements OnInit {

    dataStatus = false
    dataList = []
    dataForm: FormGroup
    selectedIndex = -1
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
        this.dataForm = this.fb.group({
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required])
        })

    }

    ngOnInit() {
        this.ds.list().subscribe((resp: any) => {
            if (resp.success === true) {
                this.dataList = resp.data
                this.dataStatus = true
            }
        })
    }

    get g() {
        return this.dataForm.controls
    }

    openModal(amenityModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.dataForm.patchValue(this.dataList[index])
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
        let saveUpdate = this.ds.save(data.value)
        if (this.selectedIndex > -1) {
            saveUpdate = this.ds.update(data.value)
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
                    this.dataList[this.selectedIndex] = data.value
                } else {
                    data.value.id = resp.data
                    this.alert.success('added successfully!!')
                    this.dataList.push(data.value)
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
        this.ds.delete(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading = false

                    return false
                } else {
                    this.alert.success('deleted successfully!!')
                    this.dataList.splice(this.selectedIndex, 1)
                    this.modalRef.hide()
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
    }
}
