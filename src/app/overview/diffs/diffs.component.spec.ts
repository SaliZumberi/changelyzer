import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffsComponent } from './diffs.component';

describe('DiffsComponent', () => {
  let component: DiffsComponent;
  let fixture: ComponentFixture<DiffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
