import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { DataService } from './../data.service'
import { ApiService } from 'src/app/services/api.service';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'

@Component({
    selector: 'app-personal-info',
    templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
    formFG: FormGroup
    employeeId: any = -1
    userType: any
    data: any
    employeeForm = false
    bankList: any = []
    designationList: any = []
    loginLoading = false
    constructor(private fb: FormBuilder,
        public ui: UIHelpers,
        public dataService: DataService,
        public api: ApiService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router,
    ) {
        this.makeForm()
        this.dataService.step = 'personal-info'
        this.dataService.getBankList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.bankList = resp.data
            }
        })
        this.dataService.designationList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.designationList = resp.data
            }
        })

        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.employeeId = params.id
                const param: any = { id: this.employeeId }
                this.dataService.getEmployee(param).subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        this.router.navigate(['/admin/employees/list'])
                    }
                    if (resp.success === true) {
                        this.formFG.patchValue(resp.data)
                        this.formFG.patchValue(resp.data.user)
                        this.employeeForm = true
                    }
                })
            } else {
                this.employeeForm = true
            }
        })
        this.userType = this.api.user.user_type
    }
    get g() {
        return this.formFG.controls
    }
    ngOnInit() {
    }

    makeForm() {
        this.formFG = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            gender: new FormControl(null, [Validators.required]),
            dob: new FormControl(null, [Validators.required]),
            user_type: new FormControl(null, [Validators.required]),
            designation_id: new FormControl(null, [Validators.required]),
            experience: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            email: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            contact_1: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            contact_2: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            whatsapp_no: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            skype: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            address: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
            account_no: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            bank_id: new FormControl(null, []),
            branch_code: new FormControl(null, [Validators.minLength(4), Validators.maxLength(6)])
        })
    }
    save(data: any): boolean {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        data.value.dob = moment(data.value.dob).format('YYYY-MM-DD')

        let saveMethod = this.dataService.add(data.value)
        if (this.employeeId > -1) {
            saveMethod = this.dataService.update(data.value)
        }
        saveMethod.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.employeeId > -1) {
                    this.alert.success('Profile updated successfully')
                } else {
                    this.employeeId = resp.data.id
                    this.alert.success('Profile created successfully')
                }
                this.router.navigate(['/admin/employees/salary-details'], { queryParams: { id: this.employeeId }, replaceUrl: true })
            }
        })
    }
    findInvalidControls() {
        const invalid = [];
        const controls = this.formFG.controls
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name)
            }
        }
        console.log(invalid)
        return invalid;
    }
}
