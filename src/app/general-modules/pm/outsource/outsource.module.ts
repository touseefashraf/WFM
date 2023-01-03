import { AdminSharedModule } from '../../../admin-panel/admin-shared/admin-shared.module';
import { OutsourceListComponent } from './outsource-list/outsource-list.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutsourceComponent } from './outsource.component';
import { DataService } from './data.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker"

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: OutsourceComponent,
                children: [
                    {
                        path: 'list',
                        component: OutsourceListComponent
                    },
                    {
                        path: 'project-info',
                        component: ProjectInfoComponent
                    },
                ]
            }
        ])
    ],
    declarations: [OutsourceComponent, OutsourceListComponent, ProjectInfoComponent],
    providers: [ DataService ],
    exports: [CommonModule]
})
export class OutsourceModule { }
