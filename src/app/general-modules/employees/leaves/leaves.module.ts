
import { AdminSharedModule } from '../../../admin-panel/admin-shared/admin-shared.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { ModalModule } from 'ngx-bootstrap/modal'
import { CommonModule } from '@angular/common'
import { LeavesComponent } from './leaves.component'


@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: LeavesComponent,
            }
        ])
    ],
    declarations: [LeavesComponent],
    providers: [DataService]
})
export class LeavesModule { }
