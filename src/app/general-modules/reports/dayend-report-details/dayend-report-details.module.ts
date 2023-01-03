import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { DataService } from './data.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DayendReportDetailsComponent } from './dayend-report-details.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        AdminSharedModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: DayendReportDetailsComponent
            }
        ])
    ],
    declarations: [DayendReportDetailsComponent],
    providers: [DataService]
})
export class DayendReportDetailsModule { }
