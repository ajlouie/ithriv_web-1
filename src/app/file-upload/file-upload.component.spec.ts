import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { FileAttachment } from '../file-attachment';
import { FormField } from '../form-field';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let httpMock: HttpTestingController;
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [FileUploadComponent],
        imports: [
          FormsModule,
          HttpClientTestingModule,
          MatTableModule,
          ReactiveFormsModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        component.field = new FormField({
          formControl: new FormControl(),
          attachments: new Map<number | string, FileAttachment>(),
          required: false,
          placeholder: 'Attachments',
          type: 'files'
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
