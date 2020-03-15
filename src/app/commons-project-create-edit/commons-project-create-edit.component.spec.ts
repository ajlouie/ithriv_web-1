import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsProjectCreateEditComponent } from './commons-project-create-edit.component';

describe('CommonsProjectCreateEditComponent', () => {
  let component: CommonsProjectCreateEditComponent;
  let fixture: ComponentFixture<CommonsProjectCreateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsProjectCreateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
