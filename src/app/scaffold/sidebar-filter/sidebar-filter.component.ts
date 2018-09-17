import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, of, pipe, Subject} from 'rxjs';
import * as _ from 'lodash';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Change} from '../../common/data/models/change';
import {DataService} from '../../common/services/data.service';


@Component({
  selector: 'sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.css']
})
export class SidebarFilterComponent implements OnInit {

  @Input()
  diffs: any;

  @Input() set searchKeyword(data: any) {
    if (data.length>0) {
      if (this.diffs) {
        this.doStuff(data)
      } else {
        this.dataService.getDiffs(0,10).subscribe(diffs => {
          this.diffs = diffs;
          this.doStuff(data)
        });
      }

    }
  }

  doStuff(data) {
    this.isLoading.emit(true);
    let searchValue = '';
    if (data.changeId) {
      searchValue = data.changeId;

    } else if (data.elementId) {
      searchValue = '-' + data.elementId;
    }
    this.getData(searchValue).subscribe(results => {
      this.filteredDiffs = _.sortBy(results, 'number_of_clusters');
      this.onFiltering.emit(this.filteredDiffs);
      this.isLoading.emit(false);
    });
  }

  allDiffs: any;
  filteredDiffs: any;

  @Output()
  onFiltering = new EventEmitter();

  @Output()
  isLoading = new EventEmitter();

  searchTerm$ = new Subject<string>();


  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.allDiffs = this.diffs;
    this.search(this.searchTerm$)
      .subscribe(results => {
        this.filteredDiffs = results;
        this.onFiltering.emit(results);
      });
  }

  search(terms: Observable<string>) {
    const debouncetime = pipe(debounceTime(1000));
    return terms.pipe(debouncetime, distinctUntilChanged(), switchMap((term: string) => this.getData(term)));
  }

  getData(searchWord: string): Observable<any[]> {
    this.isLoading.emit(true);
    const searchIndexVectors: number[] = [];
    const searchStringVectors: string[] = [];
    const searchStringElement: string[] = [];
    searchWord.split(',').forEach(searchWordItem => {
      if (searchWordItem.includes('-')) {
        searchStringElement.push(searchWordItem.replace('-', ''));
      } else {
        const parsedNumber = parseInt(searchWordItem, 10);
        return isNaN(parsedNumber) ? searchStringVectors.push(searchWordItem.toLowerCase()) : searchIndexVectors.push(parsedNumber);
      }
    })
    ;

    if (searchWord.length === 0) {
      return of(this.allDiffs);
    }

    let filteredDiffsVectors = [];
    if (searchIndexVectors.length > 0) {
      filteredDiffsVectors = _.filter(this.allDiffs, diff => {
        return _.difference(searchIndexVectors, diff.vectorized).length === 0;
      });
    }

    let filteredDiffsElements = [];
    if (searchStringVectors.length > 0) {
      filteredDiffsElements = _.filter(this.allDiffs, diff => {
        return diff.changes.filter((change: Change) => {
          return change && change.unvectorized.toLowerCase().includes(searchStringVectors[0]);
        }).length > 0;
      });
    }

    let filteredStringElement = [];
    if (searchStringElement.length > 0) {
      searchStringElement.forEach(searchStringElement => {
        let result = _.filter(this.allDiffs, diff => {
          return diff.changes.filter((change: Change) => {
            return change && change.vectorized.split(' ').find(ele => {
              return searchStringElement === ele;
            });
          }).length > 0;
        });
        filteredStringElement = _.uniqBy(filteredStringElement, 'base');
        filteredStringElement.push(...result);
      });
    }

    let x = [];
    x.push(...filteredStringElement);
    x = _.uniqBy(x, 'base');
    x.push(...filteredDiffsVectors);
    x = _.uniqBy(x, 'base');
    x.push(...filteredDiffsElements);
    let xx = _.uniqBy(x, 'base');
    this.isLoading.emit(false);
    return of(xx);
  }

}
