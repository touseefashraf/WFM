import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from '../data.service'

@Component({
    selector: 'app-project-credentials',
    templateUrl: './project-credentials.component.html',
    styleUrls: ['./project-credentials.component.css']
})
export class ProjectCredentialsComponent implements OnInit {
    projectCredentialsList = []
    dataStatus = 'fetching'
    credentialsForm: FormGroup
    selectedIndex: any
    selectedId: any
    projectId: any
    modalRef: any
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 7,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        private dataService: DataService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public api: ApiService,
        public ui: UIHelpers,
        private ms: BsModalService,
    ) {
        this.projectId = this.route.snapshot.queryParamMap.get('id')

        this.credentialsForm = this.fb.group({
            id: new FormControl(null),
            // project_id: new FormControl(null, this.projectId),
            title: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            ip_url: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            port: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            username_email: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            password: new FormControl(null, [Validators.required, Validators.maxLength(125)]),
            key: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.dataService.getProjectCredentialsList(this.projectId).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            }

            if (resp.success === true) {
                console.log('projectCredentialsList', resp.data)
                this.projectCredentialsList = resp.data
                this.projectCredentialsList.map(o => ({ ...o, showPassword: false }))
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.credentialsForm.controls
    }

    openModalSubject(credentialsModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.credentialsForm.patchValue(this.projectCredentialsList[index])
        }
        this.modalRef = this.ms.show(
            credentialsModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    save(f: any) {
        this.loginLoading = true
        if (this.credentialsForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.credentialsForm.value.id,
            title: this.credentialsForm.value.title,
            ip_url: this.credentialsForm.value.ip_url,
            port: this.credentialsForm.value.port,
            username_email: this.credentialsForm.value.username_email,
            password: this.credentialsForm.value.password,
            key: this.credentialsForm.value.key,
            project_id: this.projectId,
        }

        let saveUpdate = this.dataService.addCredentials(params)
        if (this.credentialsForm.value.id !== null) {
            saveUpdate = this.dataService.updateCredentials(params)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.credentialsForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    const index = this.projectCredentialsList.findIndex((credential: any) => {
                        return credential.id === this.credentialsForm.value.id
                    })
                    console.log('Index', index)

                    this.projectCredentialsList[index] = resp.data

                } else {
                    this.projectCredentialsList.push(resp.data)
                    this.alert.success('Credentials added successfully!!')
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.dataService.deleteCredentials(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                this.loginLoading = false

                return false
            } else {
                const deletingIndex = this.projectCredentialsList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.projectCredentialsList.splice(deletingIndex, 1)
                this.modalRef.hide()
                this.alert.success('Credentials deleted successfully!!')
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    goToBack() {
        this.router.navigate(['admin/projects/project-milestones'], { queryParams: { id: this.projectId }, replaceUrl: true })
    }
}
