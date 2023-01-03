import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { PartialPayComponent } from './partial-pay/partial-pay.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SalerySlipsComponent } from './salery-slips.component'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal'
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminSharedModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: SalerySlipsComponent },
            {
                path: 'partial',
                component: PartialPayComponent
            }

        ])
    ],
    providers: [DataService],
    declarations: [SalerySlipsComponent, PartialPayComponent]
})
export class SalerySlipsModule { }
