import {Injectable} from '@angular/core';
import {Change} from '../data/models/change';
import {Topic} from '../data/models/topic';
import {Contribution} from '../data/models/contribution';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {map} from 'rxjs/operators';
import {Diff} from '../data/models/diff';

declare var require: any;

@Injectable({
    providedIn: 'root'
})
export class DataService {
    S3_API = 'https://s3.eu-central-1.amazonaws.com/changelyzer/';
    LOCAL_API = '../../../assets/json/';

    diffsSubscription = new BehaviorSubject<Diff[]>([]);
    diffs$ = this.diffsSubscription.asObservable();

    changesSubscription = new BehaviorSubject([]);
    changes$ = this.changesSubscription.asObservable();

    changesWhatSubscription = new BehaviorSubject([]);
    changesWhat$ = this.changesWhatSubscription.asObservable();

    changesWhereSubscription = new BehaviorSubject([]);
    changesWhere$ = this.changesWhereSubscription.asObservable();


    elementsSubscription = new BehaviorSubject([]);
    elements$ = this.elementsSubscription.asObservable();

    changes_w2v;
    ldaTopics;
    ldaTopics40;
    ldaDocs40;

    constructor(private http: HttpClient, private loadingSpinner: NgxSpinnerService) {
        this.fetchData(false);
    }

    fetchData(bigDataMode: boolean = false) {
        this.loadingSpinner.show();
        let diffsSource;
        let changesSource;
        let elementsSource;
        this.changes_w2v = JSON.parse(require('../../../assets/json/word2vec.json'));
        this.ldaTopics = JSON.parse(require('../../../assets/json/lda_topics.json'));
        this.ldaTopics40 = JSON.parse(require('../../../assets/json/lda_topics_40.json'));
        this.ldaDocs40 = JSON.parse(require('../../../assets/json/lda_docs_40.json'));
        if (!bigDataMode) {
            /*    this.diffs = JSON.parse(require('../../../assets/json/diffs.json'));
                  this.changes = JSON.parse(require('../../../assets/json/changes.json'));
                  this.elements = JSON.parse(require('../../../assets/json/elements.json'));*/
            diffsSource = this.getLocalFile('diffs');
            changesSource = this.getLocalFile('changes'); //this.getLocalFile('changes');//this.getLocalFile('changes');
            elementsSource = this.getLocalFile('elements');
        } else {
            diffsSource = this.getFile('diffs');
            changesSource = this.getFile('changes');
            elementsSource = this.getFile('elements');
        }
        forkJoin([diffsSource, changesSource, elementsSource]).subscribe(results => {
            console.log('BigdataMode: ' + bigDataMode);

            let changes = JSON.parse(results[1]);
            const changesWhere = JSON.parse(require('../../../assets/json/changes_where.json'));
            const changesWhat = JSON.parse(require('../../../assets/json/changes_what.json'));

            let elements = JSON.parse(results[2]);

           // const diffs: Diff[] = JSON.parse(results[0]);
            const diffs = JSON.parse(require('../../../assets/json/diffs/diffs_base.json'));
            const diffsVectorized = JSON.parse(require('../../../assets/json/diffs/diffs_vectorized.json'));
            //   const diffsMultiAll = JSON.parse(require('../../../assets/json/changes_where.json'));
            const diffsMultiWhat = JSON.parse(require('../../../assets/json/changes_where.json'));
            //    const diffsMultiWhere = JSON.parse(require('../../../assets/json/changes_where.json'));
            // const diffsWhere = this.getDiffWhere(diffs, changes, changesWhere); //JSON.parse(require('../../../assets/json/diffs_where.json'));
            // const diffsWhat = this.getDiffWhat(diffs, changes, changesWhat); //JSON.parse(require('../../../assets/json/diffs_what.json'));
            console.log('fetched successfully, start mapping of diffs');


            if (bigDataMode) {
                changes[0].vectorized = '';
                changes[0].unvectorized = '';
            }

            console.log('fetched successfully, start mapping of diffs');
            diffs.forEach((diff, index) => {
                diff.vectorizedWhat = diffsVectorized[index].vectorized.split(' ').map(stringVector => {
                    return changes[parseInt(stringVector, 10)].what;
                });
                diff.changesWhat = diff.vectorizedWhat.map(whatVector => {
                    return changesWhere[whatVector];
                });

                diff.vectorizedWhere = diffsVectorized[index].vectorized.split(' ').map(stringVector => {
                    return changes[parseInt(stringVector, 10)].where;
                });
                diff.changesWhere = diff.vectorizedWhere.map(whatVector => {
                    return changesWhere[whatVector];
                });
                diff.vectorized = this.getVectorArray(diffsVectorized[index].vectorized);
                diff.changes = this.getChangesForVector(diff.vectorized, changes);
                // console.log(diff.changes);
            });

            console.log('counts changes ');
            this.countAllElements(diffs, changes, elements);

            console.log('count elements ');
            this.countAllChanges(diffs, changes);
            // this.countAllDiffs(diffs);


            /*      this.changes.forEach(change => {
                    change.count = this.countChanges(change);
                  });*/
            console.log('sorting changes ');

            changes = _.sortBy(changes, 'count').reverse();

            /*      this.elements.forEach(element => {
                    element.count = this.countElements(element);
                  });*/
            console.log('sort elements ');
            elements = _.sortBy(elements, 'count').reverse();

            console.log('lda thingy ');
            this.ldaTopics = this.mapTopicFromJson(this.ldaTopics, changes);
            this.ldaTopics40 = this.mapTopicFromJson(this.ldaTopics40, changes);
            this.ldaDocs40 = this.mapDocFromJson(this.ldaDocs40, this.ldaTopics40);
            console.log('finito');
            this.loadingSpinner.hide();


            //Fire up everything..

            this.diffsSubscription.next(diffs);

            this.changesSubscription.next(changes);
            this.changesWhatSubscription.next(changesWhat);
            this.changesWhereSubscription.next(changesWhere);

            this.elementsSubscription.next(elements);

        });

    }

    getDiffWhere(diffs, changes: Change[], changesWhere: Change[]) {
        const diffsWhere: any[] = _.cloneDeep(diffs);
        diffsWhere.forEach(diff => {
            diff.vectorized = diff.vectorized.split(' ').map(stringVector => {
                return changes[parseInt(stringVector, 10)].where;
            });
            diff.changes = diff.vectorized.map(whatVector => {
                return changesWhere[whatVector];
            });
        });
        return diffsWhere;
    }

    getDiffWhat(diffs, changes: Change[], changesWhat: Change[]) {
        const diffsWhat: any[] = _.cloneDeep(diffs);
        diffsWhat.forEach(diff => {
            diff.vectorized = diff.vectorized.split(' ').map(stringVector => {
                return changes[parseInt(stringVector, 10)].what;
            });
            diff.changes = diff.vectorized.map(whatVector => {
                return changesWhat[whatVector];
            });
        });
        return diffsWhat;
    }

    getVectorArray(vector: string): number[] {
        return vector.split(' ').map(stringVector => {
            return parseInt(stringVector, 10);
        });
    }

    getChangesForVector(vectors: number[], changeCorpus: Change[]): Change[] {
        return vectors.map(vector => {
            return changeCorpus[vector];
        });
    }

    countChanges(change: Change, diffCorpus): number {
        return diffCorpus.filter(diff => {
            return diff.vectorized.find(changeString => {
                return parseInt(changeString, 10) === change.index;
            });
        }).length;
    }

    countElements(element: any, diffCorpus, changeCorpus): number {
        return diffCorpus.filter(diff => {
            return diff.vectorized.find(changeString => {
                let foundChange = changeCorpus.find((change: Change) => {
                    return parseInt(changeString, 10) === change.index;
                });
                console.log('foundChange');
                console.log(foundChange);
                console.log('element');
                console.log(element);
                return foundChange.vectorized.split(' ').find(ele => {
                    return element.index === parseInt(ele, 10);
                });
            });
        }).length;
    }

    countAllElements(diffCorpus, changeCorpus, elementCorpus) {
        diffCorpus.forEach(diff => {
            diff.changes.forEach(change => {
                if (change && change.vectorized) {
                    change.vectorized.split(' ').forEach(element => {
                        if (changeCorpus[parseInt(element, 10)]) {
                            if (changeCorpus[parseInt(element, 10)].count) {
                                changeCorpus[parseInt(element, 10)].count += 1;
                            } else {
                                changeCorpus[parseInt(element, 10)].count = 1;
                            }
                        }
                    });
                }
            });
        });
    }

    countAllChanges(diffCorpus, changeCorpus) {
        diffCorpus.forEach(diff => {
            diff.changes.forEach(change => {
                if (change && change.index && changeCorpus[change.index]) {
                    if (changeCorpus[change.index].count) {
                        changeCorpus[change.index].count += 1;
                    } else {
                        changeCorpus[change.index].count = 1;
                    }
                }
            });
        });
    }

    countAllDiffs(diffCorpus) {
        diffCorpus.forEach(diff => {
            diff.count = diffCorpus.filter(diffC => {
                return _.isEqual(diff.changes.sort(), diffC.changes.sort());
            });
        });
    }

    mapTopicFromJson(lda_topics: any, changeCorpus): Topic[] {
        let topics: Topic[] = [];
        lda_topics.forEach((top, i) => {
            let contributions: Contribution[] = [];
            for (let i = 1; i < 5; i++) {
                let stringTopic = top[i].split('-');
                let stringChange = stringTopic[0];
                let stringPercentage = stringTopic[1].slice(0, 4);
                let change: Change = changeCorpus.find(change => {
                    return change.index == parseInt(stringChange, 10);
                });
                contributions.push({obj: change, percentage: stringPercentage});
            }
            topics.push({index: i, changeContributions: contributions});
        });
        return topics;
    }

    mapDocFromJson(docss: any, tops: any): any {
        let docs: any = [];
        docss.forEach((top, i) => {
            let contributions: any[] = [];
            for (let i = 1; i < 5; i++) {
                if (top[i]) {
                    let stringTopic = top[i].split('-');
                    let topicNumber = stringTopic[0];
                    let stringPercentage = stringTopic[1].slice(0, 4);
                    //let topic: Topic = tops[parseInt(topicNumber, 10)];
                    contributions.push({topic: parseInt(topicNumber, 10), percentage: stringPercentage});
                }
            }
            docs.push({index: i, contributions: contributions});
        });

        return docs;
    }

    getDiffs(minSize, maxSize): Observable<Diff[]> {
        return this.diffs$.pipe(map((diffs: any) => diffs.filter(diff => {
            return (diff.changes.length >= minSize) && (diff.changes.length <= maxSize);
        })), map(diffs => {
            return _.sortBy(diffs, 'count').reverse();
        }));
    }


    getChanges() {
        return this.changes$;
    }

    getChangesWhat() {
        return this.changesWhat$;
    }

    getChangesWhere() {
        return this.changesWhere$;
    }

    getElements() {
        return this.elements$;
    }

    getChangesW2V() {
        return this.changes_w2v;
    }

    getLdaTopics(numberOfTopics: number): Topic[] {
        let topics = [];
        if (numberOfTopics === 40) {
            topics = this.ldaTopics40;
        } else {
            topics = this.ldaTopics;
        }
        topics.forEach((topic: Topic) => {
            topic.diffContribution = [];
        });
        return topics;
    }

    getLdaDocs(numberOfTopics: number): Topic[] {
        if (numberOfTopics === 40) {
            return this.ldaDocs40;
        } else {
            return this.ldaTopics;
        }
    }

    public getFile(name: string): Observable<any> {
        return this.http.get<string>(this.S3_API + name + '.json');
    }

    public getLocalFile(name: string): Observable<any> {
        return this.http.get<string>(this.LOCAL_API + name + '.json');
    }
}
