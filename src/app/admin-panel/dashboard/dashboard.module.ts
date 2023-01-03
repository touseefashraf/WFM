import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { BusinessDevelopmentDashboardComponent } from './business-development-dashboard/business-development-dashboard.component';
import { ProjectManagerDashboardComponent } from './project-manager-dashboard/project-manager-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { DashboardComponent } from './dashboard.component'
import { ChartsModule } from 'ng2-charts'

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: DashboardComponent,
                children:[
                    { path: 'project-manager', component: ProjectManagerDashboardComponent },
                    { path: 'business-development', component: BusinessDevelopmentDashboardComponent },
                    { path: 'financial', component: FinancialDashboardComponent }
                ]
            }
        ]),
        ChartsModule,
    ],
    declarations: [DashboardComponent,ProjectManagerDashboardComponent,BusinessDevelopmentDashboardComponent,FinancialDashboardComponent],
    providers: [ DataService ]
})
export class DashboardModule { }
