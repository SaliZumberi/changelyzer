import {Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import {Change} from '../../common/data/models/change';
import {PagerService} from '../../common/services/pager.service';

@Component({
    selector: 'app-word2vec',
    templateUrl: './word2vec.component.html',
    styleUrls: ['./word2vec.component.css']
})
export class Word2vecComponent implements OnInit {
    changes: Change[];
    word2vecs: any[];

    groupedChanges: any;

    collapse: string = 'closed';
    show: boolean = false;

    // pager object
    pager: any = {};

    // paged items
    pagedChangetems: any[];

    isLoading: boolean;

    constructor(private dataService: DataService, private pagerService: PagerService) {
    }


    ngOnInit() {
        this.changes; // = this.dataService.getChanges();
        this.word2vecs = this.dataService.getChangesW2V();
        this.groupedChanges = this.getCluster(this.word2vecs);
        this.setPage(1);
    }


    getCluster(data): any[] {
        let clusters = [];
        let clusterNumber = data.length;
        let i = 0;
        for (i = 0; i < clusterNumber; i++) {
            clusters.push([]);
        }
        data.forEach((row, rowIndex) => {
            for (i = 1; i < 11; i++) {
                let splitted = row[i].split('-');
                let changeIndex = parseInt(splitted[0], 10);
                let percentage = splitted[1].substr(0, 4);
                let change = this.changes.find(change => {
                    return change.index == changeIndex;
                });
                clusters[rowIndex].push({obj: change, percentage: percentage});
            }
        });
        return clusters;
    }

    toggleCollapse() {
        this.show = !this.show;
        this.collapse = this.collapse == 'open' ? 'closed' : 'open';
    }


    getChange(changeIndex) {
        return this.changes.find(change => {
            return change.index == changeIndex;
        });
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.groupedChanges.length, page);

        // get current page of items
        this.pagedChangetems = this.groupedChanges.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}
