import { Observable } from 'rxjs'
import { ApiService } from '../services/api.service'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router'
import { Injectable } from '@angular/core'
import { ConstantsService } from '../services/constants.service'
import { AdminSidebarService } from '../admin-panel/admin-shared/admin-sidebar/admin-sidebar.service'

@Injectable({
    providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {

    constructor(
        private api: ApiService,
        private router: Router,
        private adminService: AdminSidebarService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        const routeExceptions = ['not-authorized']
        if (this.api.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
            return true
        }

        if (routeExceptions.indexOf(state.url.split('/').pop()) > -1 ) {
            return true
        }
        console.log('Route', state.url)
        console.log('segment', state.url.split('/').pop())

        if (this.adminService.checkRoutePermission(state.url.split('admin/').pop())) {
            return true
        } else {
            console.log('redirect to /admin/not-authorized by PermissionsGuard')
            this.router.navigateByUrl('/admin/not-authorized')

            return false
        }
    }
}
