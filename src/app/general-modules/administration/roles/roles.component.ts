import { ApiService } from 'src/app/services/api.service';
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
    readablePermissionsList = []
    permissionsList = []
    rolesList = []
    dataStatus = false
    dataForm: FormGroup
    selectedIndex = -1
    modalRef: BsModalRef
    selectedId: any
    searchString = ''
    selectedPermissions = []
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 3,
        colSpans: {
            0: 1,
        }
    }
    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public api:ApiService
    ) {
        this.ds.getPermissionsList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.permissionsList = resp.data
                this.readablePermissionsList = resp.data
                this.ds.rolesList().subscribe((d: any) => {
                    if (resp.success === true) {
                        this.rolesList = d.data
                        this.dataStatus = true
                    }
                })
            }
        })
        this.dataForm = this.fb.group({
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
    }
    checkIfPermissionExist(data: any) {
        // const index = this.employeeDetails.user_permissions.findIndex(d => d.permission_id == data.id)
        // if (index > -1) {
        //     return true
        // } else {
        //     return false
        // }
    }
    addRemovePermission(d: any) {
        console.log('asdfasdfas');

        const index = this.permissionsList.findIndex(data => data.id == d.id)
        const indexSelectedPermissions = this.selectedPermissions.findIndex(data => data.id == d.id)
        if (index > -1) {
            this.selectedPermissions.push(this.permissionsList[index])
            this.permissionsList.splice(index, 1)
        }
        if (indexSelectedPermissions > -1) {
            console.log('gggggg');

            this.permissionsList.push(this.selectedPermissions[indexSelectedPermissions])
            this.selectedPermissions.splice(indexSelectedPermissions, 1)

        }
    }
    get g() {
        return this.dataForm.controls
    }

    openModal(amenityModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.dataForm.patchValue(this.rolesList[index])
            this.selectedPermissions = this.rolesList[index].permissions
            this.selectedPermissions.forEach((d: any) => {
                const indexPermissionList = this.permissionsList.findIndex(data => data.id == d.id)
                if (index > -1) {
                    this.permissionsList.splice(indexPermissionList, 1)
                }
            })
        }
        this.modalRef = this.ms.show(
            amenityModal,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
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
        if (this.selectedPermissions.length == 0) {
            this.alert.error('Please Select atleast one permission')
            this.loginLoading = false

            return false
        }
        data.value.permissionIds = []
        this.selectedPermissions.forEach((d: any) => {
            data.value.permissionIds.push(d.id)
        })
        let saveUpdate = this.ds.addRole(data.value)
        if (this.dataForm.value.id !== null) {
            saveUpdate = this.ds.updateRole(data.value)
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
                    this.rolesList[this.selectedIndex] = resp.data
                } else {
                    this.alert.success('added successfully!!')
                    this.rolesList.push(resp.data)
                }
            }
            this.permissionsList = [...this.readablePermissionsList]
            this.selectedPermissions = []
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.ds.deleteRole(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading = false

                    return false
                } else {
                    this.rolesList.splice(this.selectedIndex, 1)
                    this.alert.success('deleted successfully!!')
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
        this.permissionsList = [...this.readablePermissionsList]
        this.selectedPermissions = []
        this.searchString = ''
    }

}
