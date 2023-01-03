import { ConstantsService } from './../../../services/constants.service';
import { Injectable } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    toggled = false
    _hasBackgroundImage = true
    completeMenu = []
    userMenu = []

    constructor(public api: ApiService) {
        this.completeMenu = [
            {
                title: 'Dashboard',
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                permissions: ['admin-dashboard'],
                active: true,
                type: 'simple'
            },
            {
                title: 'Projects',
                icon: 'fas fa-project-diagram',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Projects',
                        link: 'projects/projects-list',
                        type: 'simple',
                        permissions: ['projects']
                    },
                    {
                        title: 'Add New Project',
                        link: 'projects/general-details',
                        // queryParams: { id: -1 },
                        type: 'simple',
                        permissions: ['save-project']
                    },
                    {
                        title: 'Project Leads',
                        link: 'leads',
                        type: 'simple',
                        permissions: ['lead-list']
                    },
                    {
                        title: 'Clients',
                        link: 'clients/client-list',
                        type: 'simple',
                        permissions: ['client-list']
                    },
                    {
                        title: 'Project Financial Report',
                        link: 'project-financial-report',
                        type: 'simple',
                        permissions: ['project-financial-report']
                    },
                ]
            },
            {
                title: 'Accounts',
                icon: 'fas fa-chart-bar',
                active: false,
                type: 'dropdown',
                submenus: [

                    {
                        title: 'Accounts',
                        link: 'accounts',
                        type: 'simple',
                        permissions: ['accounts']
                    },
                    {
                        title: 'Incomes',
                        link: 'income',
                        type: 'simple',
                        permissions: ['incomes']
                    },
                    {
                        title: 'Expenses',
                        link: 'expense',
                        type: 'simple',
                        permissions: ['expenses']
                    },
                    {
                        title: 'Fiscal Year',
                        link: 'fiscal-year',
                        type: 'simple',
                        permissions: ['fiscal-year-list']
                    },
                    {
                        title: 'Currency',
                        link: 'currency',
                        type: 'simple',
                        permissions: ['currency-list']
                    },
                    {
                        title: 'Increment Types',
                        link: 'increment-types',
                        type: 'simple',
                        permissions: ['increment-type-list']
                    },
                    {
                        title: 'Financial Stats',
                        link: 'financial-stats',
                        type: 'simple',
                        permissions: []
                    }
                ]
            },
            {
                title: 'Salaries',
                icon: 'fas fa-chart-bar',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Make Salaries',
                        link: 'make-salaries',
                        type: 'simple',
                        permissions: ['generate-salaries']
                    },
                    {
                        title: 'Salary Increments',
                        link: 'salary-increments',
                        type: 'simple',
                        permissions: ['increment-salary']
                    },
                    {
                        title: 'Salary Slips ',
                        link: 'salary-slips',
                        type: 'simple',
                        permissions: ['salary-slips']
                    },
                    {
                        title: 'Salary Aggregate',
                        link: 'salaries-aggregate',
                        type: 'simple',
                        permissions: ['salaries-aggregate']
                    },
                    {
                        title: 'Employee Salary Log',
                        link: 'employee-salary-log',
                        type: 'simple',
                        permissions: ['employee-salary-log']
                    },
                ]
            },
            {
                title: 'Attendance',
                icon: 'fas fa-clipboard-list',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Attendance List',
                        link: 'attendance',
                        permissions: ['attendance-list']
                    },
                    {
                        title: 'Correction Request',
                        link: 'attendance-requests',
                        type: 'simple',
                        permissions: ['attendance-requests']
                    },
                    {
                        title: 'Attendance Correction Requests',
                        link: 'attendance-correction-requests',
                        type: 'simple',
                        permissions: ['my-attendance-requests']
                    },
                    {
                        title: 'My Attendance Log',
                        link: 'attendance-log',
                        type: 'simple',
                        permissions: ['my-attendance']
                    }
                ]
            },
            {
                title: 'Leaves',
                icon: 'fas fa-clipboard-list',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'My Leave Requests',
                        link: 'my-leave-requests',
                        type: 'simple',
                        permissions: ['my-leave-requests']
                    },
                    {
                        title: 'Leave Requests',
                        link: 'leave-requests',
                        type: 'simple',
                        permissions: ['leave-requests']
                    },
                    {
                        title: 'Leaves',
                        link: 'leaves',
                        type: 'simple',
                        permissions: ['leaves']
                    }
                ]
            },
            {
                title: 'HR',
                icon: 'fas fa-tags',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Employees',
                        link: 'employees/list',
                        type: 'simple',
                        permissions: ['employee-list']
                    },
                    {
                        title: 'Out Source',
                        link: 'outsource/list',
                        type: 'simple',
                        permissions: ['outsourcers-list']
                    }
                ]
            },
            {
                title: 'Administration',
                link: 'settings',
                icon: 'fas fa-cog',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Basic Settings',
                        link: 'settings',
                        type: 'simple',
                        permissions: ['settings']
                    },
                    {
                        title: 'Roles',
                        link: 'roles',
                        type: 'simple',
                        permissions: ['add-user-roles']
                    },
                    {
                        title: 'Designation',
                        link: 'designation',
                        type: 'simple',
                        permissions: ['designation-list']
                    },
                    {
                        title: 'Expense Categories',
                        link: 'expense-categories',
                        type: 'simple',
                        permissions: ['expense-categories']
                    },
                    {
                        title: 'Income Categories',
                        link: 'income-categories',
                        type: 'simple',
                        permissions: ['income-categories']
                    },
                    {
                        title: 'Banks',
                        link: 'banks',
                        type: 'simple',
                        permissions: ['bank-list']
                    }
                ]
            },
            {
                title: 'Dayend Reports',
                icon: 'fas fa-tags',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Dayend Reports',
                        link: 'dayend-report',
                        type: 'simple',
                        permissions: ['dayend-report-list']
                    },
                    {
                        title: 'Dayend Report Details',
                        link: 'dayend-report-details',
                        type: 'simple',
                        permissions: ['dayend-report']
                    }
                ]
            }
        ] // menu

        if (this.api.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
            return
        }
        this.completeMenu.forEach((menuItem: any) => {
            if (menuItem.type === 'simple') {
                const index = this.api.user.permissions.findIndex((item: any) => menuItem.permissions.indexOf(item.name) > -1)
                if (index > -1) {
                    this.userMenu.push(menuItem)
                }
            }

            if (menuItem.type === 'dropdown') {
                const submenu = []
                menuItem.submenus.forEach((subMenuItem: any) => {
                    const index = this.api.user.permissions.findIndex((item: any) => subMenuItem.permissions.indexOf(item.name) > -1)
                    if (index > -1) {
                        submenu.push(subMenuItem)
                    }
                })
                if (submenu.length > 0) {
                    menuItem.submenus = submenu
                    this.userMenu.push(menuItem)
                }
            }
        })
    }

    toggle() {
        this.toggled = !this.toggled
    }

    getSidebarState() {
        return this.toggled
    }

    setSidebarState(state: boolean) {
        this.toggled = state
    }

    getMenuList() {
        if (this.api.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
            return this.completeMenu
        } else {
            return this.userMenu
        }
    }

    get hasBackgroundImage() {
        return this._hasBackgroundImage
    }

    set hasBackgroundImage(hasBackgroundImage) {
        this._hasBackgroundImage = hasBackgroundImage
    }

    checkRoutePermission(route: string): boolean {
        let permissions: any = []
        this.completeMenu.forEach((menuItem: any) => {
            if (menuItem.type === 'dropdown') {
                const index = menuItem.submenus.findIndex((submenuItem: any) => submenuItem.link === route)
                if (index > -1) {
                    permissions = menuItem.submenus[index].permissions
                    return
                }
            } else {
                if (menuItem.link === route) {
                    permissions = menuItem.permissions
                    return
                }
            }
        })

        return this.api.checkPermissions(permissions)
    }
}
