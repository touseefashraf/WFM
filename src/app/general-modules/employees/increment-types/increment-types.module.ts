import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { SharedModule } from './../../../website/shared/shared.module'
import { NgModule } from '@angular/core'
import { IncrementTypesComponent } from './increment-types.component'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        AdminSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: IncrementTypesComponent
            }
        ])
    ],
    declarations: [IncrementTypesComponent],
    providers: [DataService]
})
export class IncrementTypesModule { }
