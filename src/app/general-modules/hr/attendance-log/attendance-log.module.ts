import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceLogComponent } from './attendance-log.component';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service'
import { FormsModule } from '@angular/forms';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    AdminSharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: AttendanceLogComponent,
      }
    ])
  ],
  declarations: [AttendanceLogComponent],
  providers:[DataService]
})
export class AttendanceLogModule { }
