import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.css']
})
export class CardGroupComponent implements OnInit {

  @Input()
  groupType: string;

  @Input()
  data: any;

  @Input()
  dataIndex: any;

  @Input()
  collapsedItems: number = 10;

  collapse: string = 'closed';
  show: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.show = (this.dataIndex < this.collapsedItems);
  }

  toggleCollapse() {
    this.show = !this.show;
    this.collapse = this.collapse == 'open' ? 'closed' : 'open';
  }

  isMinContribution(percentage: string, min: number= 0.05): boolean {
    return parseFloat(percentage) > min && parseFloat(percentage) < 1;
  }
}
