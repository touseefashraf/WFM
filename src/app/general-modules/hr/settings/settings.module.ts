import { SharedModule } from './../../../website/shared/shared.module';
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module';

import { IAlertsModule } from './../../../libs/ialert/ialerts.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SettingsComponent } from './settings.component'
import { DataService } from './data.service'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'



@NgModule({
  imports: [
    CommonModule,
    IAlertsModule,
    FormsModule,
    AdminSharedModule,
    SharedModule,
    TimepickerModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
        { path: '', component: SettingsComponent }
    ])
  ],
  declarations: [SettingsComponent],
  providers:[DataService],
  exports:[CommonModule]
})
export class SettingsModule { }
