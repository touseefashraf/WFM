import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module';

import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { IncomeComponent } from './income.component'

@NgModule({
  imports: [
      FormsModule,
      ModalModule.forRoot(),
      ReactiveFormsModule,
      AdminSharedModule,
      RouterModule.forChild([
        {
            path: '',
            component: IncomeComponent,
        }
      ])
    ],
  declarations: [IncomeComponent],
  providers:[DataService]
})
export class IncomeModule { }
