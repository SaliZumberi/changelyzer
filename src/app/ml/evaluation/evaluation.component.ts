import {Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import {PagerService} from '../../common/services/pager.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  evaluationType: string;
  clusterIndex: any;
  topicIndex: any;
  scores: any[] = [{
    name: 'Dissimilar', value: 0, isChecked: false
  },
    {name: 'Slightly dissimilar', value: 1, isChecked: false},
    {name: 'Slightly similar', value: 2, isChecked: false},
    {name: 'Similar', value: 3, isChecked: false},
    {name: 'Very Similar', value: 4, isChecked: false}];

  constructor(private dataService: DataService, private pagerService: PagerService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => console.log(params));
    this.route.params
      .subscribe(data => {
        this.evaluationType = data.type;
        this.clusterIndex = data.clusterIndex;
        this.topicIndex = data.topicIndex;
        window.scrollTo(0, 0);
      });
  }

  ngOnInit() {
  }


  selectCheckbox(index) {
    this.scores.forEach(score => {
      score.isChecked = false;
    });
    this.scores[index].isChecked = true;
  }

  next(){

  }
}
