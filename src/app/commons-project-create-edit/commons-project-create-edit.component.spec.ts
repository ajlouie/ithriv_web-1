import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatBadgeModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTreeModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileDropModule } from 'ngx-file-drop';
import { MarkdownModule } from 'ngx-markdown';
import { NgProgressModule } from 'ngx-progressbar';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FormFieldLabelComponent } from '../form-field-label/form-field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { mockProject } from '../shared/fixtures/project';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { TreeSelectComponent } from '../tree-select/tree-select.component';

import { CommonsProjectCreateEditComponent } from './commons-project-create-edit.component';

describe('CommonsProjectCreateEditComponent', () => {
  let httpMock: HttpTestingController;
  let component: CommonsProjectCreateEditComponent;
  let fixture: ComponentFixture<CommonsProjectCreateEditComponent>;
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        CommonsProjectCreateEditComponent,
        FileUploadComponent,
        FormFieldComponent,
        FormFieldLabelComponent,
        TreeSelectComponent,
      ],
      imports: [
        ColorPickerModule,
        FileDropModule,
        FormsModule,
        HttpClientTestingModule,
        MarkdownModule,
        MatBadgeModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatTableModule,
        MatToolbarModule,
        MatTreeModule,
        NgProgressModule,
        NoopAnimationsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ReactiveFormsModule,
        RichTextEditorModule,
        RouterTestingModule,
      ],
      providers: [
        ResourceApiService,
        {provide: Router, useValue: mockRouter},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(CommonsProjectCreateEditComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.currentForm = '';
    component.previousForm = '';
    component.project = mockProject;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
