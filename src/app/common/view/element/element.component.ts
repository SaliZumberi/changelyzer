import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  @Input()
  element;

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
  }

  showDiffs() {
    this.dataService.getElements().subscribe(elements => {
        let result = elements.find(el => {
          return el.unvectorized == this.element;
        });
        this.router.navigate(['/diffs', {elementId: result.index}]);
      }
    );
  }
}
