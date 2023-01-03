import { AdminSharedModule } from '../../../admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgModule } from '@angular/core'
import { DataService } from './data.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { EmployeeSaleryComponent } from './employee-salery.component'

@NgModule({
    imports: [
        AdminSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: EmployeeSaleryComponent }
        ])
    ],
    declarations: [EmployeeSaleryComponent],
    providers: [DataService]

})
export class EmployeeSaleryModule { }
