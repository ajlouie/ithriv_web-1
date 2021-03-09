import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { CategoryFormComponent } from './category-form.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('CategoryFormComponent', () => {
  let httpMock: HttpTestingController;
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [CategoryFormComponent],
        imports: [
          MatDialogModule,
          FormsModule,
          HttpClientTestingModule,
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
          {
            provide: MatDialogRef, useValue: {
              close: (dialogResult: any) => { },
              updateSize: (dialogResult: any) => { },
            }
          },
          { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(CategoryFormComponent);
        component = fixture.componentInstance;
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
