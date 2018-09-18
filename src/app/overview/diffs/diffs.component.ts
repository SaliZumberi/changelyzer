import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import {PagerService} from '../../common/services/pager.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-diffs',
    templateUrl: './diffs.component.html',
    styleUrls: ['./diffs.component.css']
})
export class DiffsComponent implements OnInit, AfterViewInit {
    diffs: any[];

    isLoading: boolean;

    // pager object
    pager: any = {};

    // paged items
    pagedDiffItems: any[];
    searchKeyword: {};

    constructor(private dataService: DataService, private pagerService: PagerService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(data => {
                this.isLoading = true;
                this.searchKeyword = data;
                window.scrollTo(0, 0);
            });
        this.dataService.getDiffs(0, 1).subscribe(diffs => {
            this.diffs = diffs;
            this.isLoading = false;
            this.setPage(1);
        });
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.diffs.length, page);

        // get current page of items
        this.pagedDiffItems = this.diffs.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    ngAfterViewInit(): void {

    }
}
