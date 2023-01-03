import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MakeSalariesComponent } from './make-salaries.component'
import { DataService } from './data.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    RouterModule.forChild([
        { path: '', component: MakeSalariesComponent }
    ])

  ],
  providers: [DataService],
  declarations: [MakeSalariesComponent]
})
export class MakeSalariesModule { }
