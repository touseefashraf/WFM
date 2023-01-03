import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { SharedModule } from './../../../website/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EmployeeSalaryLogComponent } from './employee-salary-log.component'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminSharedModule,
        RouterModule.forChild([
            { path: '', component: EmployeeSalaryLogComponent }
        ])
    ],
    declarations: [EmployeeSalaryLogComponent],
    providers: [DataService]
})
export class EmployeeSalaryLogModule { }
