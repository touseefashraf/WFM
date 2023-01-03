import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttendanceRequestsComponent } from './attendance-requests.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        IAlertsModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: AttendanceRequestsComponent }
        ])
    ],
    declarations: [AttendanceRequestsComponent],
    providers: [DataService]
})
export class AttendanceRequestsModule { }
