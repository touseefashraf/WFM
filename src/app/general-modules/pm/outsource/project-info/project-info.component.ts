import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { DataService } from '../data.service'
import { ApiService } from 'src/app/services/api.service';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-project-info',
    templateUrl: './project-info.component.html',
    styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {
    formFG: FormGroup
    projectId: any = -1
    userType: any
    data: any
    projectForm = false
    loginLoading = false
    constructor(private fb: FormBuilder,
        public ui: UIHelpers,
        private dataService: DataService,
        public api: ApiService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router
    ) {
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.projectId = params.id
                const param: any = { id: this.projectId }
                this.dataService.getOutsource(param).subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        this.router.navigate([this.userType + '/outsource/list'])
                    }
                    if (resp.success === true) {
                        this.data = resp.data
                        if (this.data) {
                            this.makeForm()
                        }
                    }
                })
            } else {
                this.makeForm()
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
        this.projectForm = true
        if (this.projectId > -1) {
            this.formFG = this.fb.group({
                id: new FormControl(this.data.id),
                type: new FormControl(this.data.type, [Validators.required]),
                name: new FormControl(this.data.name, [Validators.required, Validators.maxLength(50)]),
                email: new FormControl(this.data.email, [Validators.required, Validators.maxLength(150)]),
                skype: new FormControl(this.data.skype, [Validators.required, Validators.maxLength(50)]),
                contact_1: new FormControl(this.data.contact_1, [Validators.required, Validators.maxLength(15)]),
                contact_2: new FormControl(this.data.contact_2, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(this.data.description, [Validators.required, Validators.maxLength(255)])
            })
        } else {
            this.formFG = this.fb.group({
                id: new FormControl(null),
                type: new FormControl(null, [Validators.required]),
                name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
                email: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
                contact_1: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                contact_2: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                skype: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(null, [Validators.required, Validators.maxLength(255)])
            })
        }
    }
    save(data: any): boolean {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        let saveMethod = this.dataService.add(data.value)
        if (this.projectId > -1) {
            saveMethod = this.dataService.update(data.value)
        }
        saveMethod.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.projectId > -1) {
                    this.alert.success('Oursource updated successfully')
                } else {
                    this.alert.success('Oursource created successfully')
                }
                this.router.navigate([this.userType + '/outsource/list'])
            }
        })
    }
}
