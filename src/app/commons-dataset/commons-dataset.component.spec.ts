import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsDatasetComponent } from './commons-dataset.component';

describe('CommonsDatasetComponent', () => {
  let component: CommonsDatasetComponent;
  let fixture: ComponentFixture<CommonsDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
