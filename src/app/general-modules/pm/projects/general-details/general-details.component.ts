import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { UIHelpers } from '../../../../helpers/ui-helpers'
import { IAlertService } from '../../../../libs/ialert/ialerts.service'
import { ApiService } from '../../../../services/api.service'
import { DataService } from '../data.service'

@Component({
    selector: 'app-general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.css']
})
export class GeneralDetailsComponent implements OnInit {
    projectForm: FormGroup
    projectId: any = -1
    data: any
    clients: any = []
    currency: any = []
    loginLoading = false

    constructor(
        public ds: DataService,
        private router: Router,
        private route: ActivatedRoute,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
    ) {
        this.projectForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
            client_id: new FormControl(null, [Validators.required]),
            currency_id: new FormControl(null, [Validators.required]),
            status: new FormControl(null, [Validators.required]),
            repo_link: new FormControl(null, [Validators.required]),
            start_date: new FormControl(null, [Validators.required]),
            deadline: new FormControl(null, [Validators.required]),
            fee_percentage: new FormControl(null, [Validators.required]),
            recruiter: new FormControl(1, [Validators.required]),
            description: new FormControl(null, [Validators.maxLength(1000)]),
        })

        this.ds.getClients().subscribe((resp: any) => {
            this.clients = resp.data
            // console.log(this.clients)
        })

        this.ds.getCurrencys().subscribe((resp: any) => {
            this.currency = resp.data
            console.log('currency', this.currency)
        })

        this.projectId = this.route.snapshot.queryParamMap.get('id')
        console.log('this.projectId', this.projectId)
        if (this.projectId) {
            this.ds.getProjectDetails(this.projectId).subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.router.navigate(['admin/projects/projects-list'])
                } else {
                    this.data = resp.data
                    this.projectForm.patchValue(this.data)
                    this.projectForm.controls.start_date.setValue(new Date(this.data.start_date))
                    this.projectForm.controls.deadline.setValue(new Date(this.data.deadline))
                    this.projectForm.controls.currency_id.setValue(this.data.currency_id)

                }
            })
        }
    }

    get g() {
        return this.projectForm.controls
    }

    ngOnInit() { }

    save(data: any): boolean {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        data.value.start_date = moment(data.value.start_date).format('YYYY-MM-DD')
        data.value.deadline = moment(data.value.deadline).format('YYYY-MM-DD')

        console.log('dataValue', data.value)

        let saveMethod = this.ds.projectSave(data.value)
        if (this.projectId) {
            saveMethod = this.ds.projectUpdate(data.value)
        }
        saveMethod.subscribe((resp: any) => {
            this.loginLoading = false
            console.log(resp.data)
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.projectId) {
                    this.alert.success('Project updated successfully')
                } else {
                    this.projectId = resp.data
                    this.alert.success('Project created successfully')
                }
                this.router.navigate(['admin/projects/projects-document'], { queryParams: { id: this.projectId }, replaceUrl: true })
            }
        })
    }
}
