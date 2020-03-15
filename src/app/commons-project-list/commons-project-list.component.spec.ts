import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsProjectListComponent } from './commons-project-list.component';

describe('CommonsProjectListComponent', () => {
  let component: CommonsProjectListComponent;
  let fixture: ComponentFixture<CommonsProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
