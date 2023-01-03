import { ProjectCredentialsComponent } from './project-credentials/project-credentials.component'
import { ProjectMilestonesComponent } from './project-milestones/project-milestones.component'
import { StepsComponent } from './steps/steps.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { DataService } from './data.service'
import { ProjectsDocumentComponent } from './projects-document/projects-document.component'
import { GeneralDetailsComponent } from './general-details/general-details.component'
import { ProjectsListComponent } from './projects-list/projects-list.component'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProjectsComponent } from './projects.component'
import { IAlertsModule } from '../../../libs/ialert/ialerts.module'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { SharedModule } from '../../../website/shared/shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'


@NgModule({
    imports: [
        CommonModule,
        IAlertsModule,
        AdminSharedModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ModalModule.forChild(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: ProjectsComponent,
                children: [
                    {
                        path: 'projects-list',
                        component: ProjectsListComponent
                    },
                    {
                        path: 'general-details',
                        component: GeneralDetailsComponent
                    },
                    {
                        path: 'projects-document',
                        component: ProjectsDocumentComponent
                    },
                    {
                        path: 'project-milestones',
                        component: ProjectMilestonesComponent
                    },
                    {
                        path: 'project-credentials',
                        component: ProjectCredentialsComponent
                    },
                ]
            }
        ])
    ],
    declarations: [StepsComponent, ProjectsComponent, ProjectsListComponent, GeneralDetailsComponent, ProjectsDocumentComponent, ProjectMilestonesComponent, ProjectCredentialsComponent],
    providers: [DataService],
    exports: [CommonModule]
})
export class ProjectsModule { }
