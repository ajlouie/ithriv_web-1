import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsProjectComponent } from './commons-project.component';

describe('CommonsProjectComponent', () => {
  let component: CommonsProjectComponent;
  let fixture: ComponentFixture<CommonsProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
