import { ConstantsService } from './../../../services/constants.service';
import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'

@Component({
    selector: 'app-salaries-aggregate',
    templateUrl: './salaries-aggregate.component.html',
    styleUrls: ['./salaries-aggregate.component.css']
})
export class SalariesAggregateComponent implements OnInit {
    dataStatus = 'fetching'
    salariesAggregateList: any = []
    filters = {
        startMonth: moment().subtract(1, 'months').startOf('month').toDate(),
        endMonth: moment().add(1, 'months').endOf('month').toDate()
    }
    searched = false
    loginLoading = false
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        public alert: IAlertService,
        public route: ActivatedRoute,
        private router: Router,
        public cs: ConstantsService
    ) {
        if (this.route.snapshot.paramMap.has('start-month')) {
            this.filters.startMonth = moment(this.route.snapshot.paramMap.get('start-month')).toDate()
        }
        if (this.route.snapshot.paramMap.has('end-month')) {
            this.filters.endMonth = moment(this.route.snapshot.paramMap.get('end-month')).toDate()
        }
        this.search()
    }

    ngOnInit() { }

    search() {
        if (this.filters.startMonth > this.filters.endMonth) {
            this.alert.error('End Month should be greater than start month')

            return false
        }

        this.searched = true
        this.dataStatus = 'fetching'
        console.log(this.filters.startMonth, 'this.filters.startMonth', this.filters.startMonth.getMonth())
        const params = {
            start_month: this.filters.startMonth.getMonth() + 1,
            end_month: this.filters.endMonth.getMonth() + 1,
            start_year: this.filters.startMonth.getFullYear(),
            end_year: this.filters.endMonth.getFullYear()
        }

        this.loginLoading = true
        this.ds.getSalariesAggregate(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.salariesAggregateList = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/salaries-aggregate'], { queryParams: params, replaceUrl: true })
            }
        })
    }

}
