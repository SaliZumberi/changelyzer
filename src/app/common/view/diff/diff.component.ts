import {Component, Input, OnInit} from '@angular/core';
import {Diff2Html} from 'diff2html';
import {Change} from '../../data/models/change';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  @Input()
  index: number;

  diff: string;

  @Input()
  vectorized: number[];

  @Input()
  changes: Change[];

  @Input()
  basePath: string;

  @Input()
  outputFormat: string = 'side-by-side';

  outputHtml: string;

  fileA: string;

  fileB: string;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.getDiffFile().subscribe(diffFile => {
      console.log(diffFile);
      this.diff = diffFile;
      this.outputHtml = Diff2Html.getPrettyHtml(this.diff, {
        outputFormat: this.outputFormat,
        inputFormat: 'diff',
        showFiles: true,
        matching: 'word'
      });
    }, error => {
      console.log(error);
    });
  }

  public showFileA() {
    this.getFile('_A').subscribe(data => {
      this.fileA = data;
    });
  }

  public showFileB() {
    this.getFile('_B').subscribe(data => {
      this.fileA = data;
    });
  }

  public getFile(name: string): Observable<string> {
    return this.http.get<string>('https://s3.eu-central-1.amazonaws.com/code-changes/' + this.basePath + name + '.java', {responseType: 'text' as 'json'});
  }

  getDiffFile(): Observable<string> {
    let options = {responseType: 'text' as 'json'};
    return this.http.get<string>('https://s3.eu-central-1.amazonaws.com/code-changes/' + this.basePath + name + '_git_diff.txt', options);
  }
}
