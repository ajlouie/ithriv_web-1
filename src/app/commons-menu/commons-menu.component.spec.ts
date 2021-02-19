import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsMenuComponent } from './commons-menu.component';

describe('CommonsMenuComponent', () => {
  let component: CommonsMenuComponent;
  let fixture: ComponentFixture<CommonsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
