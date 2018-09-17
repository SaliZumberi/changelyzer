import {Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import {Topic} from '../../common/data/models/topic';
import * as _ from 'lodash';

@Component({
    selector: 'app-lda',
    templateUrl: './lda.component.html',
    styleUrls: ['./lda.component.css']
})
export class LdaComponent implements OnInit {

    isLoading: boolean;
    topics: Topic[];
    docs: any;
    diffs: any;
    selection;
    ldaType;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.topics = this.dataService.getLdaTopics(40);
        this.docs = this.dataService.getLdaDocs(40);
        this.dataService.getDiffs(0, 10).subscribe(diffs => {
            this.diffs = diffs;
        });

        this.ldaType = 'topics';
        this.selection = this.topics;
        this.setDiffs();
    }

    showTopic() {
        this.isLoading = true;
        this.selection = this.topics;
        this.ldaType = 'topics';
        this.isLoading = false;
    }

    showDocs() {
        this.isLoading = true;
        this.selection = this.docs;
        this.ldaType = 'documents';
        this.isLoading = false;
    }

    setDiffs(amount: number = 10) {
        this.docs.forEach((doc, diffIndex) => {
            doc.contributions.forEach((contribution, contIndex) => {
                this.topics[contribution.topic].diffContribution.push({obj: this.diffs[diffIndex], percentage: contribution.percentage});
            });
        });
        this.topics.forEach((topic: Topic) => {
            topic.diffContribution = _.sortBy(topic.diffContribution, 'percentage').reverse();
        });
    }

}
