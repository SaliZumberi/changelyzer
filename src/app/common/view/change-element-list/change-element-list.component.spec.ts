import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeElementListComponent } from './change-element-list.component';

describe('ChangeElementListComponent', () => {
  let component: ChangeElementListComponent;
  let fixture: ComponentFixture<ChangeElementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeElementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
