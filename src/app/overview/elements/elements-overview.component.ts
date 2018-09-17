import {Component, OnInit} from '@angular/core';
import {DataService} from '../../common/services/data.service';
import {Change} from '../../common/data/models/change';
import {Router} from '@angular/router';

@Component({
  selector: 'app-elements-overview',
  templateUrl: './elements-overview.component.html',
  styleUrls: ['./elements-overview.component.css']
})
export class ElementsOverviewComponent implements OnInit {

  diffs: any[];
  changes: Change[];
  elements: any[];

  isLoading: boolean;

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
    this.dataService.getDiffs(0,10).subscribe(diffs => {
      this.diffs = diffs;
    });
    this.dataService.getChanges().subscribe((changes: Change[]) => {
      this.changes = changes;
    });
    this.dataService.getElements().subscribe((elements: any) => {
      this.elements = elements;
    });
  }

  showDiffs(element) {
    this.router.navigate(['/diffs', {elementId: element.index}]);
  }

}
