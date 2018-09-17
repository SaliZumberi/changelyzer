import {Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import * as _ from 'lodash';
import {
  trigger,
  state,
  style,
  animate,
  transition

} from '@angular/animations';

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed', style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('400ms ease-in')),
      transition('open => closed', animate('200ms ease-out'))
    ])
  ]
})
export class KmeansComponent implements OnInit {


  elementsClusters: any;
  diffsClusters: any;
  changesClusters: any;

  diffs;
  changes;
  elements;

  isLoading: boolean;

  selectedKMeans;

  clusterType: string;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getDiffs(0,10).subscribe(diffs => {
      this.diffs = diffs;
    });
    this.changes = this.dataService.getChanges();
    this.elements = this.dataService.getElements();
    this.elementsClusters = this.getCluster(this.elements, false);
    this.diffsClusters = this.getCluster(this.diffs, true);
    this.changesClusters = this.getCluster(this.changes, false);
  }

  getClustersNumber(data) {
    return (_.uniqBy(data, function (e) {
      return e.cluster;
    })).length;
  };

  getCluster(data, shuffle) {
    let clusters = [];
    let clusterNumber = this.getClustersNumber(data);
    let i = 0;
    for (i = 0; i < clusterNumber; i++) {
      clusters.push([]);
    }
    data.forEach(row => {
      clusters[row.cluster].push(row);
    });
    if (shuffle) {
      clusters = _.shuffle(clusters, 'length');
    } else {
      clusters = _.sortBy(clusters, 'length').reverse();
    }
    return clusters;
  }

  showElementsCluster() {
    this.clusterType ='elements';
    this.selectedKMeans = this.elementsClusters;
  }

  showDiffsCluster() {
    this.clusterType ='diffs';
    this.selectedKMeans = this.diffsClusters;
  }

  showChangesCluster() {
    this.clusterType ='changes';
    this.selectedKMeans = this.changesClusters;
  }

}
