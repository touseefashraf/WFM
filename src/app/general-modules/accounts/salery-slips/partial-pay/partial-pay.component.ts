import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
@Component({
  selector: 'app-partial-pay',
  templateUrl: './partial-pay.component.html',
  styleUrls: ['./partial-pay.component.css']
})
export class PartialPayComponent implements OnInit {
    modalRef: BsModalRef
    modalTitle: any = 'modalTitle Here'
  constructor(public ms:BsModalService) { }

  ngOnInit() {
  }

}
