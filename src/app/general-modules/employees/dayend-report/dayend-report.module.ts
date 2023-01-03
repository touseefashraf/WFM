import { AddEditDetailsComponent } from './add-edit-details/add-edit-details.component';
import { DataService } from './data.service'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DayendReportComponent } from './dayend-report.component'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AngularEditorModule } from '@kolkov/angular-editor'

@NgModule({
    imports: [
        AdminSharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AngularEditorModule ,
        RouterModule.forChild([
            {
                path: '',
                component: DayendReportComponent
            },
            {
                path: 'edit',
                component: AddEditDetailsComponent
            },
            {
                path: 'add',
                component: AddEditDetailsComponent
            },
        ])
    ],
    declarations: [DayendReportComponent,AddEditDetailsComponent],
    providers: [DataService]
})
export class DayendReportModule { }
