import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttendanceCorrectionComponent } from './attendance-correction.component'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminSharedModule,
    PopoverModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        { path: '', component: AttendanceCorrectionComponent }
    ])
  ],
  providers: [DataService],
  declarations: [AttendanceCorrectionComponent]
})
export class AttendanceCorrectionModule { }
