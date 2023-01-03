import { Component, OnInit, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from '../data.service'

@Component({
    selector: 'app-list-client',
    templateUrl: './list-client.component.html',
    styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit {
    dataStatus = 'fetching'
    clientList = []
    userType: any
    spinnerSVG = `/assets/img/default.png`
    thumbnail: any = '/assets/img/default.png'
    deletePop: any

    selectedIndex: any
    selectedId: any
    modalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 7,
        colSpans: {
            0: 1,
        }
    }
    constructor(
        private ds: DataService,
        public api: ApiService,
        private router: Router,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.userType = this.api.user.user_type
    }

    ngOnInit() {

        this.ds.getClient().subscribe((resp: any) => {
            if (resp.success === true) {
                this.clientList = resp.data
                this.dataStatus = 'done'
            }

        })
    }

    edit(idx: number) {
        this.router.navigateByUrl(`/${this.api.user.user_type}/clients/addedit-client?index=${idx}`)
    }

    deleteClient() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.ds.deleteClient(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.deletePop.hide()
                    this.loginLoading = false

                    return false
                } else {
                    this.clientList.splice(this.selectedIndex, 1)
                    this.deletePop.hide()
                    this.alert.success('Client deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

}
