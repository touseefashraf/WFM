import { Component, OnInit, TemplateRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { IAlertService } from '../../../../libs/ialert/ialerts.service'
import { ApiService } from '../../../../services/api.service'
import { DataService } from '../data.service'

@Component({
    selector: 'app-projects-list',
    templateUrl: './projects-list.component.html',
    styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
    dataStatus = 'fetching'
    projectsList = []
    userType: any = ''
    selectedId: any
    selectedIndex: any
    modalRef: BsModalRef
    page = 1
    pagination: any
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 8,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        private ds: DataService,
        private alert: IAlertService,
        public api: ApiService,
        private ms: BsModalService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.userType = this.api.user.user_type
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params) {
                this.getlist()
            } else {
                this.getlist()
            }
        })
    }

    ngOnInit() {
    }

    getlist() {
        this.ds.projectsList(this.page).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                console.log(resp.data)
                this.projectsList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    delete() {
        this.loginLoading = true
        const params = {
            id: this.selectedId
        }
        this.ds.projectDelete(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                this.loginLoading = false

                return false
            } else {
                const deletingIndex = this.projectsList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.projectsList.splice(deletingIndex, 1)
                this.modalRef.hide()
                this.alert.success('Project deleted successfully!!')
            }
        })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    getRecruiter(recruiter: string) {
        const recruiterStatus = {
            1: 'Yes',
            0: 'No',
        }

        return recruiterStatus[recruiter]
    }

    getRecruiterClass(recruiter: string) {
        const recruiterColor = {
            1: 'sm i-badge blue',
            0: 'sm i-badge red',
        }

        return recruiterColor[recruiter]
    }

    getStatusFormat(status: string) {
        const statusFormat = {
            in_progress: 'In Progress',
            support: 'Support',
            closed: 'Closed',
        }

        return statusFormat[status]
    }

    getStatusClass(status: string) {
        const statusFormat = {
            in_progress: 'sm i-badge yellow',
            support: 'sm i-badge blue',
            closed: 'sm i-badge red',
        }

        return statusFormat[status]
    }

    // edit(id: number) {
    //     this.router.navigateByUrl(`/${this.api.user.user_type}/projects/general-details?id=${id}`)
    // }

    // add() {
    //     this.router.navigateByUrl(`/${this.api.user.user_type}/projects/general-details?id=-1`)
    // }
}
