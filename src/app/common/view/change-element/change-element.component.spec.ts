import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeElementComponent } from './change-element.component';

describe('ChangeElementComponent', () => {
  let component: ChangeElementComponent;
  let fixture: ComponentFixture<ChangeElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
