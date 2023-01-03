import { IncrementSalaryComponent } from '../increment-salary/increment-salary.component'
import { ApiService } from './../../../../services/api.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './../data.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'

@Component({
    selector: 'app-list',
    templateUrl: './employees-list.component.html',
    styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
    dataStatus = 'fetching'
    empList = []
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    page = 1
    pagination: any
    employeeData: any = {}
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
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public route: ActivatedRoute,
        public router: Router,
        public api: ApiService,
    ) {
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params) {
                this.getlist()
            } else {
                this.getlist()
            }
        })
    }

    ngOnInit() {

    }

    openModalSubject(incSalaryModal, empData) {
        this.employeeData = empData
        this.modalRef = this.ms.show(
            incSalaryModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false,
            }
        )
        this.api.IncrementSalaryModalRef = this.modalRef
    }

    getlist() {
        this.ds.get(this.page).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.empList = resp.data
                this.dataStatus = 'done'
                console.log('empList', this.empList)

            }
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
                    const deletingIndex = this.empList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.empList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Employee deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }
}


