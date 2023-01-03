import { ApiService } from 'src/app/services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConstantsService } from 'src/app/services/constants.service';
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import * as moment from 'moment'
@Component({
    selector: 'app-dayend-report',
    templateUrl: './dayend-report.component.html',
    styleUrls: ['./dayend-report.component.css']
})
export class DayendReportComponent implements OnInit {
    moment = moment
    date = this.cs.DATE_TIME_FORMAT.DATE
    reportList = []
    dataStatus = false
    selectedDetails = []
    modalRef: BsModalRef
    loaderOptions = {
        rows: 4,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }
    selectedIndex = -1
    constructor(
        public ds: DataService,
        public cs: ConstantsService,
        public ms: BsModalService,
        public api:ApiService
    ) {
        this.ds.dayEndReportList().subscribe((resp: any) => {
            if (resp.success == true) {
                this.reportList = resp.data
                this.dataStatus = true
            }
        })
    }
    addEditModal(addEditTemplate: TemplateRef<any>, index: any) {
        // this.selectedDetails = data.dayend_report_details
        this.modalRef = this.ms.show(
            addEditTemplate,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    openDetailsModal(detailsTemplate: TemplateRef<any>, data: any) {
        this.selectedDetails = data.dayend_report_details
        this.modalRef = this.ms.show(
            detailsTemplate,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    ngOnInit() {
    }

}
