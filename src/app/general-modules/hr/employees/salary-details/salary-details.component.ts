import { ApiService } from './../../../../services/api.service';
import { DataService } from '../data.service'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-salary-details',
    templateUrl: './salary-details.component.html',
    styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {
    saleryForm: FormGroup
    employeeId = -1
    employeeDetails: any
    dataStatus = false
    loginLoading = false
    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router,
        public api: ApiService
    ) {
        this.ds.step = 'salery-details'

        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.employeeId = params.id
            }
        })
        this.saleryForm = this.fb.group({
            employee_id: new FormControl(null, [Validators.required, Validators.min(0)]),
            basic_salary: new FormControl(null, [Validators.required, Validators.min(0)]),
            medical: new FormControl(null, [Validators.required, Validators.min(0)]),
            transport: new FormControl(null, [Validators.required, Validators.min(0)]),
            mobile: new FormControl(null, [Validators.required, Validators.min(0)]),
        })
        this.ds.getEmployeeSaleryDetails({ employee_id: this.employeeId }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.employeeDetails = resp.data
                this.dataStatus = true
                this.saleryForm.patchValue(resp.data)
            }
        })
    }

    get g() {
        return this.saleryForm.controls
    }
    save(data: any) {
        this.loginLoading = true
        console.log('data=', data.value)
        // return false
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        this.ds.updateEmployeeSaleryDetails(data.value).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Salery Details updated successfully')
                this.router.navigate(['/admin/employees/permissions'], { queryParams: { id: this.employeeId }, replaceUrl: true })

            }
        })

    }
    ngOnInit() {
    }

}
