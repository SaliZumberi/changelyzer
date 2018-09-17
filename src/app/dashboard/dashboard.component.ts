import {Component, OnInit} from '@angular/core';
import {DataService} from '../common/services/data.service';
import {PagerService} from '../common/services/pager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  diffs: any[];

  isLoading: boolean;

  // pager object
  pager: any = {};

  // paged items
  pagedDiffItems: any[];

  constructor(private dataService: DataService, private pagerService: PagerService) {
  }

  ngOnInit() {
    this.dataService.getDiffs(0,10).subscribe(diffs => {
      this.diffs = diffs;
    });
    this.setPage(1);

  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.diffs.length, page);

    // get current page of items
    this.pagedDiffItems = this.diffs.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }



}
