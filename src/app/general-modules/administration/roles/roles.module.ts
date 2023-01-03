import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { RolesComponent } from './roles.component'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        AdminSharedModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: RolesComponent,
            }
        ])
    ],
    declarations: [RolesComponent],
    providers: [DataService]
})
export class RolesModule { }
