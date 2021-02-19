import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsHomeComponent } from './commons-home.component';

describe('CommonsHomeComponent', () => {
  let component: CommonsHomeComponent;
  let fixture: ComponentFixture<CommonsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
