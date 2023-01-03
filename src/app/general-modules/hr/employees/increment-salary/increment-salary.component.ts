import { DataService } from '../data.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-increment-salary',
    templateUrl: './increment-salary.component.html',
    styleUrls: ['./increment-salary.component.css']
})
export class IncrementSalaryComponent implements OnInit, AfterViewInit {
    @Input() employeeObj: any

    increamnetSalaryForm: FormGroup
    modalRef: BsModalRef
    employeesList: any = []
    incrementTypeList: any = []
    page = 1
    loginLoading = false

    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api: ApiService,
        public ds: DataService

    ) {
        this.increamnetSalaryForm = this.fb.group({
            increment_type_id: new FormControl(null, [Validators.required]),
            employee_id: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required]),
            start_month: new FormControl(null, [Validators.required]),
            start_year: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        })

        this.ds.get(this.page).subscribe((resp: any) => {
            this.employeesList = resp.data
        })

        this.ds.getIncrementType().subscribe((resp: any) => {
            this.incrementTypeList = resp.data
        })
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.increamnetSalaryForm.controls.employee_id.setValue(this.employeeObj.id)
    }

    get g() {
        return this.increamnetSalaryForm.controls
    }

    save(f: any) {
        this.loginLoading = true
        if (this.increamnetSalaryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        const params = {
            employee_id: this.increamnetSalaryForm.value.employee_id,
            increment_type_id: this.increamnetSalaryForm.value.increment_type_id,
            amount: this.increamnetSalaryForm.value.amount,
            start_month: this.increamnetSalaryForm.value.start_month,
            start_year: this.increamnetSalaryForm.value.start_year,
            description: this.increamnetSalaryForm.value.description,
        }

        this.ds.addIncreamentSalary(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Increament Salary added successfully!!')
            }
            f.resetForm()
            this.api.IncrementSalaryModalRef.hide()
        })
    }
}
