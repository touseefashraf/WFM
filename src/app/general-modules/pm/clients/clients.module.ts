import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddeditClientComponent } from './addedit-client/addedit-client.component';
import { ListClientComponent } from './list-client/list-client.component';
import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalModule } from 'ngx-bootstrap/modal';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  imports: [
    AdminSharedModule,
    PopoverModule.forRoot(),
    SharedModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    ImageCropperModule,
    LazyLoadImageModule,
    CommonModule,
    RouterModule.forChild([
        {
            path: '',
            component:ClientsComponent,
            children: [
                {
                    path: 'client-list',
                    component:ListClientComponent
                },
                {
                    path: 'addedit-client',
                    component:AddeditClientComponent
                },
            ]
        }
    ])
  ],
  declarations: [ClientsComponent,ListClientComponent,AddeditClientComponent],
  providers:[DataService]
})
export class ClientsModule { }
