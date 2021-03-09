import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { EditResourceButtonComponent } from './edit-resource-button.component';

describe('EditResourceButtonComponent', () => {
  let component: EditResourceButtonComponent;
  let fixture: ComponentFixture<EditResourceButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditResourceButtonComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ResourceApiService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResourceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
