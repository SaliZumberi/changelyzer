import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Word2vecComponent } from './word2vec.component';

describe('Word2vecComponent', () => {
  let component: Word2vecComponent;
  let fixture: ComponentFixture<Word2vecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Word2vecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Word2vecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
