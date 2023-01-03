import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataService } from './data.service'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ChartsModule } from 'ng2-charts'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FinancialStatsComponent } from './financial-stats.component'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: FinancialStatsComponent }
        ]),
        ChartsModule,
    ],
    declarations: [FinancialStatsComponent],
    providers: [DataService]
})
export class FinancialStatsModule { }
