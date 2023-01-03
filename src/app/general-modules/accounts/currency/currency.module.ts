import { DataService } from './data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyComponent } from './currency.component';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    AdminSharedModule,
    PopoverModule.forRoot(),
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    RouterModule.forChild([
        {path:'',
        component:CurrencyComponent}
    ])
  ],
  declarations: [CurrencyComponent],
  providers:[DataService]
})
export class CurrencyModule { }
