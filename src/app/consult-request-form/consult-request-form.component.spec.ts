import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ConsultRequestFormComponent } from './consult-request-form.component';

describe('ConsultRequestFormComponent', () => {
  let httpMock: HttpTestingController;
  let component: ConsultRequestFormComponent;
  let fixture: ComponentFixture<ConsultRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultRequestFormComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatTableModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(ConsultRequestFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);

    fixture.detectChanges();

    const categoriesReq = httpMock.expectOne(`http://localhost:5000/api/consult_category_list`);
    expect(categoriesReq.request.method).toEqual('GET');
    categoriesReq.flush([]);
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
