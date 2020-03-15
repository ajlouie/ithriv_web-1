import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsDatasetCreateEditComponent } from './commons-dataset-create-edit.component';

describe('CommonsDatasetCreateEditComponent', () => {
  let component: CommonsDatasetCreateEditComponent;
  let fixture: ComponentFixture<CommonsDatasetCreateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsDatasetCreateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsDatasetCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
