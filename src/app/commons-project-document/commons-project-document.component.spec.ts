import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsProjectDocumentComponent } from './commons-project-document.component';

describe('CommonsProjectDocumentComponent', () => {
  let component: CommonsProjectDocumentComponent;
  let fixture: ComponentFixture<CommonsProjectDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsProjectDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
