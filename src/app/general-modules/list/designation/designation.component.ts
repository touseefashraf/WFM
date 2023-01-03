import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-designation',
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.css']
})
export class DesignationComponent implements OnInit {

    dataStatus = 'fetching'
    dataList = []
    dataForm: FormGroup
    selectedIndex = -1
    modalRef: BsModalRef
    selectedId: any
    modalTitle: any = ''
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 3,
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
        public api:ApiService
    ) {

        this.ds.list().subscribe((resp: any) => {
            if (resp.success === true) {
                this.dataList = resp.data
                console.log(this.dataList)
                this.dataStatus = 'done'

            }
            this.dataForm = this.fb.group({
                id: new FormControl(null),
                title: new FormControl(null, [Validators.required]),
                description: new FormControl(null, [Validators.required]),
            })

        })

    }

    ngOnInit() {

    }

    get g() {
        return this.dataForm.controls
    }

    openModal(designationModal, index) {

        this.modalTitle = 'Add New Designation'

        if (index > -1) {
            this.selectedIndex = index
            this.dataForm.controls.id.setValue(this.dataList[index].id)
            this.dataForm.patchValue(this.dataList[index])
            this.modalTitle = 'Edit Designation'
        }
        this.modalRef = this.ms.show(
            designationModal,
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
        if (this.dataForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.dataForm.value.id,
            title: this.dataForm.value.title,
            description: this.dataForm.value.description,
        }

        let saveUpdate = this.ds.add(params)
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
                    params.id = resp.data
                    this.alert.success('Added successfully!!')
                    this.dataList.push(params)
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

}
