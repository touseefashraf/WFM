import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import * as moment from 'moment'
@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    dataStatus = 'fetching'
    dataForm: FormGroup
    moment = moment
    allowedLeaves: any = 0
    startTime: any
    endTime: any
    loginLoading = false
    currency: any = []
    loaderOptions = {
        rows: 3,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ds: DataService
    ) {
        this.dataForm = this.fb.group({
            leaves_allowed: new FormControl(null, [Validators.required]),
            startTime: new FormControl(null, [Validators.required]),
            endTime: new FormControl(null, [Validators.required]),
            normal_project_fee: new FormControl(null, [Validators.required]),
            recruiter_project_fee: new FormControl(null, [Validators.required]),
            default_currency_id: new FormControl(null, [Validators.required]),
        })

        this.ds.getCurrencys().subscribe((resp: any) => {
            this.currency = resp.data
            console.log('currency', this.currency)
        })

        const getCuSettings = this.ds.getCurrentSettings()
        getCuSettings.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                // this.allowedLeaves = resp.data.leaves_allowed
                this.startTime = new Date('2020-02-02 ' + resp.data.start_time)
                this.endTime = new Date('2020-02-02 ' + resp.data.end_time)
                this.dataForm.controls.startTime.setValue(this.startTime)
                this.dataForm.controls.endTime.setValue(this.endTime)
                this.dataForm.patchValue(resp.data)
                this.dataStatus = 'done'
                console.log(resp.data)
            }
        })

    }

    ngOnInit() {

    }
    update() {
        this.loginLoading = true
        if (this.dataForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            leaves_allowed: this.dataForm.value.leaves_allowed,
            start_time: moment(this.dataForm.value.startTime).format('H:mm'),
            end_time: moment(this.dataForm.value.endTime).format('H:mm'),
            normal_project_fee: this.dataForm.value.normal_project_fee,
            recruiter_project_fee: this.dataForm.value.recruiter_project_fee,
            default_currency_id: this.dataForm.value.default_currency_id,
        }
        console.log(params);

         this.ds.updateSettings(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Settings Updated Successfully')
            }
        })
    }
}
