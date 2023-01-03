import { SharedModule } from './../../../website/shared/shared.module';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ModalModule } from 'ngx-bootstrap/modal'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LeadsComponent } from './leads.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminSharedModule,
    SharedModule,
    PopoverModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    RouterModule .forChild([
        { path: '', component: LeadsComponent },
        { path: 'lead-details/:id', component: LeadDetailsComponent }
    ])
  ],
  providers:[DataService],
  declarations: [LeadsComponent, LeadDetailsComponent]
})
export class LeadsModule { }
