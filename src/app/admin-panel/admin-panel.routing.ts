import { NotAuthorizedComponent } from './admin-shared/not-authorized/not-authorized.component';
import { PermissionsGuard } from './../auth/permissions-guard';
import { AdminPanelComponent } from './admin-panel.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminGuard } from '../auth/admin-guard'

const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        canActivate: [AdminGuard],
        children: [
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent
            }
        ]
    },
    {
        path: '',
        component: AdminPanelComponent,
        canActivate: [AdminGuard, PermissionsGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module')
                    .then(mod => mod.DashboardModule)
            },
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                    .then(mod => mod.ChangePasswordModule)
            },
            {
                path: 'clients',
                loadChildren: () => import('../general-modules/pm/clients/clients.module')
                    .then(mod => mod.ClientsModule)
            },
            {
                path: 'fiscal-year',
                loadChildren: () => import('../general-modules/accounts/fiscal-year/fiscal-year.module')
                    .then(mod => mod.FiscalYearModule)
            },
            {
                path: 'currency',
                loadChildren: () => import('../general-modules/accounts/currency/currency.module')
                    .then(mod => mod.CurrencyModule)
            },
            {
                path: 'attendance-log',
                loadChildren: () => import('../general-modules/hr/attendance-log/attendance-log.module')
                    .then(mod => mod.AttendanceLogModule)
            },
            {
                path: 'attendance',
                loadChildren: () => import('../general-modules/hr/attendance/attendance.module')
                    .then(mod => mod.AttendanceModule)
            },

            {
                path: 'super-password',
                loadChildren: () => import('./super-password/super-password.module')
                    .then(mod => mod.SuperPasswordModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'contact-us-page',
                loadChildren: () => import('./contact-us-page/contact-us-page.module')
                    .then(mod => mod.ContactUsPageModule)
            },
            {
                path: 'income-categories',
                loadChildren: () => import('../general-modules/accounts/income-category/income-category.module')
                    .then(mod => mod.IncomeCategoryModule)
            },

            {
                path: 'income',
                loadChildren: () => import('../general-modules/accounts/income/income.module')
                    .then(mod => mod.IncomeModule)
            },
            {
                path: 'expense-categories',
                loadChildren: () => import('../general-modules/accounts/expense-category/expense-category.module')
                    .then(mod => mod.ExpenseCategoryModule)
            },
            {
                path: 'expense',
                loadChildren: () => import('../general-modules/accounts/expense/expense.module')
                    .then(mod => mod.ExpenseModule)
            },
            {
                path: 'employees',
                loadChildren: () => import('../general-modules/hr/employees/employees.module')
                    .then(mod => mod.EmployeesModule)
            },
            {
                path: 'outsource',
                loadChildren: () => import('../general-modules/pm/outsource/outsource.module')
                    .then(mod => mod.OutsourceModule)
            },
            {
                path: 'designation',
                loadChildren: () => import('../general-modules/list/designation/designation.module')
                    .then(mod => mod.DesignationModule)
            },
            {
                path: 'banks',
                loadChildren: () => import('../general-modules/list/banks/banks.module')
                    .then(mod => mod.BanksModule)
            },
            {
                path: 'employee-saleries',
                loadChildren: () => import('../general-modules/accounts/employee-salery/employee-salery.module')
                    .then(mod => mod.EmployeeSaleryModule)
            },
            {
                path: 'make-salaries',
                loadChildren: () => import('../general-modules/accounts/make-salaries/make-salaries.module')
                    .then(mod => mod.MakeSalariesModule)
            },
            {
                path: 'projects',
                loadChildren: () => import('../general-modules/pm/projects/projects.module')
                    .then(mod => mod.ProjectsModule)
            },
            {
                path: 'attendance',
                loadChildren: () => import('../general-modules/hr/attendance/attendance.module')
                    .then(mod => mod.AttendanceModule)
            },
            {
                path: 'dayend-report',
                loadChildren: () => import('../general-modules/employees/dayend-report/dayend-report.module')
                    .then(mod => mod.DayendReportModule)
            },
            {
                path: 'dayend-report-details',
                loadChildren: () => import('../general-modules/reports/dayend-report-details/dayend-report-details.module')
                    .then(mod => mod.DayendReportDetailsModule)
            },
            {
                path: 'settings',
                loadChildren: () => import('../general-modules/hr/settings/settings.module')
                    .then(mod => mod.SettingsModule)
            },
            {

                path: 'project-financial-report',
                loadChildren: () => import('../general-modules/reports/project-financial-report/project-financial-report.module')
                    .then(mod => mod.ProjectFinancialReportModule)
            },
            {
                path: 'financial-stats',
                loadChildren: () => import('../general-modules/reports/financial-stats/financial-stats.module')
                    .then(mod => mod.FinancialStatsModule)
            },
            {
                path: 'salary-slips',
                loadChildren: () => import('../general-modules/accounts/salery-slips/salery-slips.module')
                    .then(mod => mod.SalerySlipsModule)
            },
            {
                path: 'roles',
                loadChildren: () => import('../general-modules/administration/roles/roles.module')
                    .then(mod => mod.RolesModule)
            },
            {
                path: 'increment-types',
                loadChildren: () => import('../general-modules/employees/increment-types/increment-types.module')
                    .then(mod => mod.IncrementTypesModule)
            },
            {
                path: 'salary-increments',
                loadChildren: () => import('../general-modules/accounts/salary-increment/salary-increment.module')
                    .then(mod => mod.SalaryIncrementModule)
            },
            {
                path: 'employee-salary-log',
                loadChildren: () => import('../general-modules/accounts/employee-salary-log/employee-salary-log.module')
                    .then(mod => mod.EmployeeSalaryLogModule)
            },
            {
                path: 'attendance-correction-requests',
                loadChildren: () => import('../general-modules/employees/attendance-correction/attendance-correction.module')
                    .then(mod => mod.AttendanceCorrectionModule)
            },
            {
                path: 'leads',
                loadChildren: () => import('../general-modules/pm/leads/leads.module')
                    .then(mod => mod.LeadsModule)
            },
            {
                path: 'salaries-aggregate',
                loadChildren: () => import('../general-modules/accounts/salaries-aggregate/salaries-aggregate.module')
                    .then(mod => mod.SalariesAggregateModule)
            },
            {
                path: 'attendance-requests',
                loadChildren: () => import('../general-modules/hr/attendance-requests/attendance-requests.module')
                    .then(mod => mod.AttendanceRequestsModule)

            },
            {
                path: 'accounts',
                loadChildren: () => import('../general-modules/administration/accounts/accounts.module')
                    .then(mod => mod.AccountsModule)

            },
            {
                path: 'my-leave-requests',
                loadChildren: () => import('../general-modules/employees/my-leave-request/my-leave-request.module')
                    .then(mod => mod.MyLeaveRequestModule)
            },
            {
                path: 'leave-requests',
                loadChildren: () => import('../general-modules/employees/leave-request/leave-request.module')
                    .then(mod => mod.LeaveRequestModule)
            },
            {
                path: 'leaves',
                loadChildren: () => import('../general-modules/employees/leaves/leaves.module')
                    .then(mod => mod.LeavesModule)
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutes { }
