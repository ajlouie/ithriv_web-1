import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatTreeModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormField } from '../form-field';
import { mockCategories } from '../shared/fixtures/category';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { TreeSelectComponent } from './tree-select.component';

describe('TreeSelectComponent', () => {
  let httpMock: HttpTestingController;
  let component: TreeSelectComponent;
  let fixture: ComponentFixture<TreeSelectComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [TreeSelectComponent],
        imports: [
          FormsModule,
          MatBadgeModule,
          MatTreeModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
          {provide: Router, useValue: mockRouter},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(TreeSelectComponent);
        component = fixture.componentInstance;
        component.field = new FormField({
          formGroup: new FormGroup({
            '123': new FormControl({name: '123'}),
          }),
          required: true,
          placeholder: 'Yub Nub',
          type: 'tree',
          apiSource: 'getCategories',
          multiSelect: true
        });
        fixture.detectChanges();

        const req = httpMock.expectOne(`http://localhost:5000/api/category`);
        expect(req.request.method).toEqual('GET');
        req.flush(mockCategories);

        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();

    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
