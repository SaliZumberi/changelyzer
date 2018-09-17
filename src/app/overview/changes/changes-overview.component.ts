import {Component, OnInit} from '@angular/core';
import {Change} from '../../common/data/models/change';
import {DataService} from '../../common/services/data.service';
import {Router} from '@angular/router';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-changes-overview',
  templateUrl: './changes-overview.component.html',
  styleUrls: ['./changes-overview.component.css']
})
export class ChangesOverviewComponent implements OnInit {


  diffs: any[];
  diffsWhat: any[];
  diffsWhere: any[];

  changes: Change[];
  changesWhat: any[];
  changesWhere: any[];
  getChangesW2V: any;
  isLoading: boolean = true;

  selectedChanges: Change[];
  selectedChangeType = '';


  pagedChanges;

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.requestDataFromMultipleSources().subscribe(([diffs, diffsWhat, diffsWhere, changes, changesWhat, changesWhere]) => {
      this.diffs = diffs;
      this.diffsWhat = diffsWhat;
      this.diffsWhere = diffsWhere;
      this.changes = <Change[]> changes;
      this.changesWhat = <Change[]> changesWhat;
      this.changesWhere = <Change[]> changesWhere;
      this.isLoading = false;
    });
    this.getChangesW2V = this.dataService.getChangesW2V();
  }

  getChangeFromText(element: string) {
    let splitted = element.split(' - ');
    return this.changes.find(change => {
      return parseInt(splitted[0], 10) == change.index;
    });
  }

  showDiffs(change: Change) {
    this.router.navigate(['/diffs', {changeId: change.index}]);
  }

  selectChange(changeToBeSelected: Change[], type: string) {
    this.selectedChanges = changeToBeSelected;
    this.selectedChangeType = type;
  }

  public requestDataFromMultipleSources(): Observable<any[]> {
    return combineLatest([
      this.dataService.getDiffs(0, 1),
      this.dataService.getDiffsWhat(0, 1),
      this.dataService.getDiffsWhere(0, 1),
      this.dataService.getChanges(),
      this.dataService.getChangesWhat(),
      this.dataService.getChangesWhere()]);
  }

}
