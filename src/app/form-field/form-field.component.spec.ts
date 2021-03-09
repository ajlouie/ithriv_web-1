import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ErrorStateMatcher,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { MarkdownModule } from 'ngx-markdown';
import { FormField } from '../form-field';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let httpMock: HttpTestingController;
  let component: FormFieldComponent;
  let errorMatcher: ErrorStateMatcher;
  let fixture: ComponentFixture<FormFieldComponent>;
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    errorMatcher = new ErrorStateMatcher();

    TestBed
      .configureTestingModule({
        declarations: [
          FormFieldComponent
        ],
        imports: [
          BrowserAnimationsModule,
          ColorPickerModule,
          FormsModule,
          HttpClientTestingModule,
          MarkdownModule,
          MatCardModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          OwlDateTimeModule,
          OwlNativeDateTimeModule,
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
          { provide: ErrorStateMatcher, useValue: { isErrorState: () => true } },
          {provide: Router, useValue: mockRouter},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(FormFieldComponent);
        component = fixture.componentInstance;
        component.errorMatcher = errorMatcher;
        component.field = new FormField({
          formControl: new FormControl(),
          required: false,
          placeholder: 'Beep boop boop beeee?',
          type: 'text'
        });
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
