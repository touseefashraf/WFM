import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../../helpers/ui-helpers'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'

@Component({
    selector: 'app-employee-salery',
    templateUrl: './employee-salery.component.html',
    styleUrls: ['./employee-salery.component.css']
})
export class EmployeeSaleryComponent implements OnInit {
    dataStatus = false
    saleriesList = []
    employeeList = []
    bankForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.bankForm = this.fb.group({
            id: new FormControl(null),
            employee_id: new FormControl(null, [Validators.required, Validators.min(0)]),
            basic_salary: new FormControl(null, [Validators.required, Validators.min(0)]),
            medical: new FormControl(null, [Validators.required, Validators.min(0)]),
            transport: new FormControl(null, [Validators.required, Validators.min(0)]),
            mobile: new FormControl(null, [Validators.required, Validators.min(0)]),
        })
    }

    ngOnInit() {
        this.ds.getEmployeeSaleryList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.saleriesList = resp.data
                this.dataStatus = true
            }
        })
        this.ds.getEmployeeList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.employeeList = resp.data
                this.dataStatus = true
            }
        })
    }

    get g() {
        return this.bankForm.controls
    }

    openModalSalery(saleryModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.bankForm.controls.id.setValue(this.saleriesList[index].id)
            this.bankForm.patchValue(this.saleriesList[index])
        }
        this.modalRef = this.ms.show(
            saleryModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveBank(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        let saveUpdate = this.ds.addEmployeeSalery(data.value)
        if (this.selectedIndex > -1) {
            saveUpdate = this.ds.updateEmployeeSalery(data.value)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.saleriesList[this.selectedIndex] = resp.data
                } else {
                    this.alert.success('Employee salery added successfully!!')
                    this.saleriesList.push(resp.data)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteBank() {
        const params = {
            id: this.selectedId
        }
        this.ds.deleteEmployeeSalery(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.saleriesList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.saleriesList.splice(deletingIndex, 1)
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
