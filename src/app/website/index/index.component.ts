import { DataService } from './data.service'
import { IAlertService } from './../../libs/ialert/ialerts.service'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
    data: any
    modalRef: BsModalRef
    exploreLoading = false
    buyLoading = false
    subscriptionLoading = false
    getQuoteLoading = false
    companyImagesData = []
    lastImageId = 0
    totalImageDataLength = 0
    intervalValue: any
    constructor(
        public api: ApiService,
        public alert: IAlertService,
        private ms: BsModalService,
        public ds: DataService
    ) {
        
    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        clearInterval(this.intervalValue)
    }
    openModal(modal, index) {
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-lg modal-dialog-centered website',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    cancel() {
        this.modalRef.hide()
    }

}
