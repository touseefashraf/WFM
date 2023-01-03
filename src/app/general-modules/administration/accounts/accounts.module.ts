import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { SharedModule } from './../../../website/shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccountsComponent } from './accounts.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminSharedModule ,
    SharedModule ,
    PopoverModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        { path: '', component: AccountsComponent }
    ])
  ],
  declarations: [AccountsComponent],
  providers:[DataService]
})
export class AccountsModule { }
