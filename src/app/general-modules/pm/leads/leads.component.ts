import { ActivatedRoute, Router } from '@angular/router';
import { IAlertService } from './../../../libs/ialert/ialerts.service';
import { UIHelpers } from './../../../helpers/ui-helpers'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DataService } from './data.service'
import { Component, OnInit } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import * as moment from 'moment'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-leads',
    templateUrl: './leads.component.html',
    styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
    dataStatus = ''
    planForm: FormGroup
    followForm: FormGroup
    toProjectForm:FormGroup
    moment = moment
    selectedIndex = 0
    currencies: any = []
    page = 1
    pagination: any
    leads: any = []
    loaderOptions = {
        rows: 3,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }
    selectedId = -1
    modalRef: BsModalRef
    requests: any = []
    selectedIdFollow = -1
    leadFollowUp = []
    followUpStatuses: any
    loginLoading = false

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public cs: ConstantsService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router,
        public api: ApiService
    ) {

        this.followUpStatuses = this.cs.FOLLOWUP_STATUSES

        // Set Leads Form fields
        this.planForm = this.fb.group({
            id: new FormControl(null),
            project_title: new FormControl(null, [Validators.required]),
            project_url: new FormControl(null, [Validators.required]),
            desc: new FormControl(null, [Validators.required]),
            budget: new FormControl(null, [Validators.required]),
            client_name: new FormControl(null, [Validators.required]),
            currency_id: new FormControl(null, [Validators.required])
        })

        this.followForm = this.fb.group({
            id: new FormControl(null),
            lead_id: new FormControl(null,[Validators.required]),
            title: new FormControl(null, [Validators.required]),
            status: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            followup_date: new FormControl(null, [Validators.required]),
            response: new FormControl(null, [Validators.required])
        })

        this.toProjectForm = this.fb.group({
            lead_id: new FormControl(null),
            start_date: new FormControl(null, [Validators.required]),
            deadline: new FormControl(null, [Validators.required]),
            initial_budget: new FormControl(null, [Validators.required])
        })


        // Pagination Call Code
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
                this.getLeadList()
            }
        })

    }

    get g() {
        return this.planForm.controls
    }

    get c() {
        return this.followForm.controls
    }
    get p() {
        return this.toProjectForm.controls
    }

    ngOnInit() {
        // Get List Of all added Currencies.
        this.getCurrencyList()

        // Get List Of all added Leads.
        this.getLeadList()
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page
        }
        this.router.navigate(['/admin/leads'], { queryParams: filtersParam, replaceUrl: true })
    }

    openModalFollowUp(modal, index) {


        if (index > -1) {
            this.followForm.controls.lead_id.setValue(this.leads.data[index].id)
            // this.followForm.patchValue(this.leadFollowUp[index])
        }
        this.selectedIdFollow = index
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )

    }


    openModal(modal, index) {

        if (index > -1) {

            this.planForm.controls.id.setValue(this.leads.data[index].id)
            this.planForm.patchValue(this.leads.data[index])
            this.selectedId = this.leads.data[index].id
        }

        this.selectedIndex = index

        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    openModalProject(adderModal,index) {

        this.toProjectForm.controls.initial_budget.setValue(this.leads.data[index].budget)
        this.toProjectForm.controls.lead_id.setValue(this.leads.data[index].id)

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


    getCurrencyList() {

        const currencyList = this.ds.getCurrencyList()
        currencyList.subscribe((resp: any) => {
            if (resp.success === false) {
                return false
            } else {
                this.currencies = resp.data
            }
        })
    }

    getLeadList() {

        this.dataStatus = 'fetching'

        const params = { page: this.page }

        const leadList = this.ds.getLeadList(params)
        leadList.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.dataStatus = 'done'
                this.pagination = resp.data
                this.leads = resp.data
                console.log(this.leads);

                this.router.navigate(['/admin/leads'], { queryParams: {}, replaceUrl: true })
            }
        })
    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.leads.data[this.selectedIndex].id
        }
        const deleteo = this.ds.delete(params)
        deleteo.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {

                this.leads.data.splice(this.selectedIndex, 1)

                this.alert.success('Lead Entry Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }
    save(f: any) {
        this.loginLoading = true
        if (this.planForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }

        let saveUpdate = this.ds.addNew(this.planForm.value)

        if (this.planForm.value.id !== null) {
            saveUpdate = this.ds.update(this.planForm.value)
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.leads.data[this.selectedIndex] = resp.data
                    this.selectedId = -1
                    this.selectedIndex = -1

                } else {
                    this.alert.success('Lead added successfully!!')
                    this.leads.data.push(resp.data)
                }

            }
            this.modalRef.hide()
            f.resetForm()
        })

    }

    saveFollowup(f: any) {
        this.loginLoading = true
        if (this.followForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = this.followForm.value
        params.followup_date = moment(params.followup_date).format('YYYY-MM-DD H:mm')
        let saveUpdateFollow = this.ds.addFollowup(params)

        if (params.id !== null) {
            saveUpdateFollow = this.ds.updateFollowForm(params)
        }
        saveUpdateFollow.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('Follow-up added successfully!!')
                // this.leads.data[this.selectedId] = resp.data
                this.selectedId = -1

            }
            this.modalRef.hide()
            f.resetForm()
        })

    }

    saveLeadToProject(f: any) {
        this.loginLoading = true
        if (this.toProjectForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = this.toProjectForm.value
        params.start_date = moment(params.start_date).format('YYYY-MM-DD H:mm')
        params.deadline = moment(params.deadline).format('YYYY-MM-DD H:mm')

        this.ds.convertToProject(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {
                this.alert.success('lead converted to Project!')
                console.log('response',resp.data);


            }
            this.modalRef.hide()
            f.resetForm()

            this.router.navigateByUrl(`/${this.api.user.user_type}/projects/general-details?id=${resp.data}`)
        })

    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
    cancelButtonNon() {

        this.modalRef.hide()
    }
    cancel(f: any) {
        f.resetForm()
        console.log('Form is Reset Now')
        this.modalRef.hide()
    }

    findInvalidControls() {

        const invalid = []
        const controls = this.planForm.controls
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name)
            }
        }
        console.log(invalid)

        return invalid
    }
}
