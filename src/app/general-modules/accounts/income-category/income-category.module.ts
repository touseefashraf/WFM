import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module';
import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { IncomeCategoryComponent } from './income-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    AdminSharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: IncomeCategoryComponent,
      }
    ])      
  ],
  declarations: [IncomeCategoryComponent],
  providers:[DataService]
})
export class IncomeCategoryModule { }
