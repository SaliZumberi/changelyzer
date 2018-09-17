import {Component, OnInit} from '@angular/core';
import {Change} from './common/data/models/change';
import {Subject} from 'rxjs';
import {DataService} from './common/services/data.service';
import {NgxSpinnerService} from 'ngx-spinner';
declare var require: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    diffs: any[];
    changes: Change[] = JSON.parse(require('./common/data/jsons/changes.json'));


    filteredDiffs: any;
    searchTerm$ = new Subject<string>();

    constructor(private dataService: DataService, private loadingSpinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.loadingSpinner.show();
        this.diffs = JSON.parse(require('./common/data/jsons/diffs.json'));
        this.diffs.forEach(diff => {
            diff.changes = this.getChangesForStringVector(diff.vectorized);
            diff.vectorized = this.getVectorArray(diff.vectorized);
        });
    }

    getVectorArray(vector: string): number[] {
        return vector.split(' ').map(stringVector => {
            return parseInt(stringVector, 10);
        });

    }

    getChangesForStringVector(vector: string): Change[] {
        return vector.split(' ').map(stringVector => {
            return this.changes[parseInt(stringVector, 10)];
        });
    }
}
