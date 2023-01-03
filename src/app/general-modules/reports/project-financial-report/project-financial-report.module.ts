import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFinancialReportComponent } from './project-financial-report.component';

@NgModule({
    imports: [
        AdminSharedModule,
        RouterModule.forChild([
            { path: '', component: ProjectFinancialReportComponent }
        ])
    ],
    declarations: [ProjectFinancialReportComponent]
})
export class ProjectFinancialReportModule { }
