import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesOverviewComponent } from './changes-overview.component';

describe('ChangesOverviewComponent', () => {
  let component: ChangesOverviewComponent;
  let fixture: ComponentFixture<ChangesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
