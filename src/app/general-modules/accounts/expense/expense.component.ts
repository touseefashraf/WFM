import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IAlertService } from './../../../libs/ialert/ialerts.service';
import { UIHelpers } from './../../../helpers/ui-helpers';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core'
import { DataService } from './data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {


    dataStatus = 'fetching'
    dataList = []
    catList = []
    projects = []
    dataForm: FormGroup
    selectedIndex = -1
    modalRef: BsModalRef
    selectedId: any
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,

        }
    }
    loginLoading = false
    pagination: any
    filters: any = {
        page: 1
    }

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public route: ActivatedRoute,
        public api:ApiService,
        private router: Router,

    ) {
        const paramSub = this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params) {
                this.search()
            }

        })
        paramSub.unsubscribe()

        this.ds.ExpenseCategories().subscribe((resp: any) => {
            this.catList = resp.data
        })

        // this.getExpense()

        this.dataForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required]),
            expense_category_id: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
        })
        // Pagination Call Code
        // this.route.queryParams.subscribe(params => {
        //     if (params.page) {
        //         this.page = params.page
        //         this.getExpense()
        //     }
        // })


    }

   ngOnInit() {
    }

    setPagination(page: number) {
        this.filters.page = page
        this.search()
    }

    search() {
        this.loginLoading = true
        this.dataStatus = 'fetching'
        const params = {
            page: this.filters.page,
        }

        this.ds.list(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.dataList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/expense'], { queryParams: params, replaceUrl: true })
            }
        })
    }


    // search() {
    //     this.ds.list().subscribe((resp: any) => {
    //         if (resp.success == true) {
    //             this.pagination = resp.data
    //             this.router.navigate(['/admin/expense'], { queryParams: {}, replaceUrl: true })
    //             this.dataStatus = 'done'
    //             if (this.pagination.data.length == 0) {
    //                 this.dataStatus = 'noData'
    //             }
    //         }
    //     })
    // }

    get g() {
        return this.dataForm.controls
    }


    openModal(amenityModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.dataForm.controls.id.setValue(this.dataList[index].id)
            this.dataForm.patchValue(this.dataList[index])
        }
        this.modalRef = this.ms.show(
            amenityModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
   save(data: any, f: any) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.dataForm.value.id,
            title: data.value.title,
            amount: data.value.amount,
            description: data.value.description,
            expense_category_id: data.value.expense_category_id,
        }

        let saveUpdate = this.ds.save(params)
        if (this.dataForm.value.id !== null) {
            saveUpdate = this.ds.update(params)
            this.selectedId = -1
        }
        saveUpdate.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                //this.modalRef.hide()
                //f.resetForm()
                this.loginLoading = false

                return false
            } else {
                if (this.dataForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.dataList[this.selectedIndex] = params
                    this.dataForm.controls.id.setValue(null)

                } else {
                    //params.id = resp.data
                    this.alert.success('added successfully!!')
                    this.dataList.unshift(resp.data)
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
        this.ds.delete(params)
            .subscribe((resp: any) => {
                this.loginLoading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading = false

                    return false
                } else {
                    const deletingIndex = this.dataList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.dataList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('deleted successfully!!')
                    this.selectedIndex = -1
                }
            })
    }
   confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
        this.selectedIndex = -1
    }
   resetIndex() {
        this.selectedIndex = -1
    }



}
