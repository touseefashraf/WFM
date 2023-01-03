import { DataService } from '../data.service';
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {
    @Input() step: string
    selectedId = -1

    constructor(
        private route: ActivatedRoute,
        public ds: DataService
    ) {
        this.route.queryParams.subscribe((params: any) => {
            if (params.id) {
                this.selectedId = params.id
            }
        })
    }

    ngOnInit() {
        console.log('Selected id = ', this.selectedId)
    }

}
