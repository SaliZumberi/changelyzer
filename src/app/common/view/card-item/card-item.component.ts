import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {DataService} from '../../services/data.service';
import {map, share} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {Change} from '../../data/models/change';
import {Diff} from '../../data/models/diff';

@Component({
    selector: 'card-item',
    templateUrl: './card-item.component.html',
    styleUrls: ['./card-item.component.css']
})
export class CardItemComponent implements OnInit {
    @Input()
    allData: any;

    @Input()
    data: any;

    @Input()
    dataIndex: any;

    @Input()
    type: string;

    @Input()
    collapsedItems: number = 10;

    @Output()
    showDiffs = new EventEmitter();

    @Input()
    selectedChangeType;

    show: boolean;
    collapse: string;

    pagedDiffItems: any;


    diffs: Diff[];
    changes: Change[];

    isLoading: boolean = true;


    diffExamples;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.show = (this.dataIndex < this.collapsedItems);
    }

    public requestDataFromMultipleSources(): Observable<any[]> {
        return combineLatest([
            this.dataService.getDiffs(0, 1), this.dataService.getChanges()]);
    }

    toggleCollapse() {
        this.isLoading = true;
        this.show = !this.show;
        this.collapse = this.collapse === 'open' ? 'closed' : 'open';
        this.fetchDiffExamples();
    }

    getBackgroundGradient(percentage: string): string {
        return 'rgba(220, 53, 69,' + percentage + ')';
    }

    getBackgroundGradientWord2vec(percentage: string): string {
        return 'rgba(91, 192, 190,' + percentage + ')';
    }

    getSimilarDiffs(diff: any): Observable<any[]> {
        return this.dataService.getDiffs(diff.changes.length - 1, diff.changes.length + 1).pipe(map(diffs => {
            return diffs.filter(diffC => {
                return _.isEqual(diff.changes.sort(), diffC.changes.sort());
            });
        }), share());
    }

    fetchDiffExamples() {
        if (!this.isLoading) {
            this.getDiffExamples();
        } else {
            this.requestDataFromMultipleSources().subscribe(([diffsData, changes]) => {
                this.diffs = diffsData;
                this.changes = changes;
                this.isLoading = false;
                this.getDiffExamples();
            });
        }
    }

    getDiffExamples() {
        if (this.selectedChangeType === 'all') {
            this.diffExamples = _.shuffle(this.diffs.filter(diff => {
                let includus = _.includes(diff.vectorized, this.data.index);
                return includus;

            }));
        } else if (this.selectedChangeType === 'what') {
            this.diffExamples = _.shuffle(this.diffs.filter(diff => {
                let includus = _.includes(diff.vectorizedWhat, this.data.index);
                return includus;

            }));
        } else if (this.selectedChangeType === 'where') {
            this.diffExamples = _.shuffle(this.diffs.filter(diff => {
                let includus = _.includes(diff.vectorizedWhere, this.data.index);
                return includus;
            }));
        }


    }
}
