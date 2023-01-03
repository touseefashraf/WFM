import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SalariesAggregateComponent } from './salaries-aggregate.component'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminSharedModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: SalariesAggregateComponent }
        ])
    ],
    declarations: [SalariesAggregateComponent],
    providers: [DataService]
})
export class SalariesAggregateModule { }
