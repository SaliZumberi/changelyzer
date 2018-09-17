import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'change-element-list',
  templateUrl: './change-element-list.component.html',
  styleUrls: ['./change-element-list.component.css']
})
export class ChangeElementListComponent implements OnInit {

  @Input()
  changes;

  constructor() { }

  ngOnInit() {
  }

}
