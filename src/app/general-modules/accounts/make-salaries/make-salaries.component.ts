import { ApiService } from 'src/app/services/api.service';
import { ConstantsService } from 'src/app/services/constants.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import * as moment from 'moment';

@Component({
    selector: 'app-make-salaries',
    templateUrl: './make-salaries.component.html',
    styleUrls: ['./make-salaries.component.css']
})
export class MakeSalariesComponent implements OnInit {
    dataForm: FormGroup
    months: any = []
    moment = moment

    monthYear = moment().toDate()


    salaries: any = []
    fiscalYears: any = []
    loginLoading = false

    constructor(
        public ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public cs: ConstantsService
    ) {

        this.months = this.cs.MONTHSDATA

        this.dataForm = this.fb.group({
            monthYear: new FormControl(null, [Validators.required]),
            working_days: new FormControl(null, [Validators.required])
        })
        this.getWorkingDays()

    }


    getWorkingDays() {

        const params = {
            month: this.monthYear.getMonth() + 1,
            year: this.monthYear.getFullYear()
        }

        if (params.month && params.year) {
            var offDays = this.api.user.settings.off_days.split(',');
            const dateYear = moment(`${params.year}-${params.month}`)
            var workingDays = 0

            offDays.forEach(day => {
                workingDays += this.getAmountOfWeekDaysInMonth(dateYear, day)
            })
            const nOfDays = dateYear.daysInMonth()
            this.dataForm.patchValue({ working_days: (nOfDays - workingDays) })
        }
    }

    getAmountOfWeekDaysInMonth(date, weekday) {
        date.date(1);
        var dif = (7 + (weekday - date.weekday())) % 7 + 1;
        return Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }

    get g() {
        return this.dataForm.controls
    }

    ngOnInit() {

        const fiscalYearsReq = this.ds.getFiscalYears()
        fiscalYearsReq.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.fiscalYears = resp.data

                console.log(resp.data)
            }
        })
    }

    saveForm(f: any) {
        this.loginLoading = true
        if (this.dataForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        const params = {
            month: this.monthYear.getMonth() + 1,
            year: this.monthYear.getFullYear(),
            working_days: this.dataForm.value.working_days
        }

        const saveSalary = this.ds.makeSalary(params)
        saveSalary.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.salaries = resp.data
                console.log(this.salaries)
                f.resetForm()
            }
        })
    }
}
