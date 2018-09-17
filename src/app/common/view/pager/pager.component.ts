import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagerService} from '../../services/pager.service';

@Component({
  selector: 'pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css'],
  providers: [PagerService]
})
export class PagerComponent implements OnInit {

  @Input()
  set data(data: any) {
    if(data){
      this.allData = data;
      this.setPage(1);
    }
  }

  allData;

  @Input()
  itemsPerPage;

  @Output()
  pagedItems = new EventEmitter();

  // pager object
  pager: any = {};

  constructor(private pagerService: PagerService) {
  }

  ngOnInit() {
    this.setPage(1);
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allData.length, page, this.itemsPerPage);

    // get current page of items
    let pagedDiffItems = this.allData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.pagedItems.emit(pagedDiffItems);
  }

}
