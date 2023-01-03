import { SharedModule } from 'src/app/website/shared/shared.module'
import { RolesComponent } from './roles/roles.component'
import { PermissionsComponent } from './permissions/permissions.component'
import { StepsTemplateComponent } from './steps-template/steps-template.component'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { EmployeesListComponent } from './employees-list/employees-list.component'
import { SalaryDetailsComponent } from './salary-details/salary-details.component'
import { PersonalInfoComponent } from './personal-info/personal-info.component'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EmployeesComponent } from './employees.component'
import { DataService } from './data.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { IncrementSalaryComponent } from './increment-salary/increment-salary.component'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: EmployeesComponent,
                children: [
                    {
                        path: 'list',
                        component: EmployeesListComponent
                    },
                    {
                        path: 'personal-info',
                        component: PersonalInfoComponent
                    },
                    {
                        path: 'salary-details',
                        component: SalaryDetailsComponent
                    },
                    {
                        path: 'permissions',
                        component: PermissionsComponent
                    },
                    {
                        path: 'roles',
                        component: RolesComponent
                    },
                ]
            }
        ])
    ],
    declarations: [
        EmployeesComponent,
        EmployeesListComponent,
        PersonalInfoComponent,
        SalaryDetailsComponent,
        StepsTemplateComponent,
        PermissionsComponent,
        RolesComponent,
        IncrementSalaryComponent
    ],
    providers: [DataService],
    exports: [CommonModule]
})
export class EmployeesModule { }
