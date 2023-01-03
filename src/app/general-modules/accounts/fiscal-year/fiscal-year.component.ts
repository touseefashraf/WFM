import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import * as moment from 'moment'
@Component({
    selector: 'app-fiscal-year',
    templateUrl: './fiscal-year.component.html',
    styleUrls: ['./fiscal-year.component.css']
})
export class FiscalYearComponent implements OnInit {

    dataStatus = 'fetching'
    thumbnail: any = '/assets/img/default.png'
    spinnerSVG = `/assets/images/spinner.svg`
    deletePop: any
    fyForm: FormGroup
    yearsData = []
    selectedIndex: any
    selectedId: any
    modalRef: BsModalRef
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
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
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.fyForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            start_date: new FormControl(null, [Validators.required]),
            end_date: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {

        this.ds.getFy().subscribe((resp: any) => {
            if (resp.success === true) {
                this.yearsData = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.fyForm.controls
    }

    openModalSubject(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            // this.fyForm.controls.id.setValue(this.yearsData[index].id)
            this.fyForm.patchValue(this.yearsData[index])
            this.fyForm.controls.start_date.setValue(new Date(this.yearsData[index].start_date))
            this.fyForm.controls.end_date.setValue(new Date(this.yearsData[index].end_date))
        }
        this.modalRef = this.ms.show(
            adderModal,
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
        if (this.fyForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        if ((moment(this.fyForm.value.start_date)).diff(moment(this.fyForm.value.end_date)) > 0) {
            this.alert.error('Year Start Date can not be greater than End Date..')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.fyForm.value.id,
            title: this.fyForm.value.title,
            description: this.fyForm.value.description,
            start_date: moment(this.fyForm.value.start_date).format('YYYY-MM-DD').toString(),
            end_date: moment(this.fyForm.value.end_date).format('YYYY-MM-DD').toString(),
        }

        let saveUpdate = this.ds.addFy(params)
        if (this.fyForm.value.id !== null) {
            saveUpdate = this.ds.updateFy(params)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.fyForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.yearsData[this.selectedIndex] = params
                    this.fyForm.controls.id.setValue(null)

                } else {
                    params.id = resp.data
                    this.alert.success('Year added successfully!!')
                    this.yearsData.push(params)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        console.log('Form is Reset Now')
        this.modalRef.hide()
    }

}
