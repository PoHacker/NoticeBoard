import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeDetailedComponent } from './notice-detailed.component';

describe('NoticeDetailedComponent', () => {
  let component: NoticeDetailedComponent;
  let fixture: ComponentFixture<NoticeDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
