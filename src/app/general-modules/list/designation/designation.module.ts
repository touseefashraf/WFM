import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module'
import { DesignationComponent } from './designation.component'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        CommonModule,
        IAlertsModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        AdminSharedModule,
        RouterModule.forChild([{
            path: '', component: DesignationComponent
        }])
    ],
    declarations: [DesignationComponent],
    providers: [DataService],
    exports: [CommonModule]
})
export class DesignationModule { }
