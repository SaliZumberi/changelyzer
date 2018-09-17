import {Component, Input, OnInit} from '@angular/core';
import {Change} from '../../data/models/change';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'change-element',
  templateUrl: './change-element.component.html',
  styleUrls: ['./change-element.component.scss']
})
export class ChangeElementComponent implements OnInit {

  @Input()
  change: Change;

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
  }

  showDiffs() {
    this.router.navigate(['/diffs', {changeId: this.change.index}]);
  }
}
