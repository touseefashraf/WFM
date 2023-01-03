import { DataService } from './data.service'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { SharedModule } from './../../../website/shared/shared.module'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SalaryIncrementComponent } from './salary-increment.component'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminSharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SalaryIncrementComponent
            }
        ])
    ],
    declarations: [SalaryIncrementComponent],
    providers: [DataService]
})
export class SalaryIncrementModule { }
