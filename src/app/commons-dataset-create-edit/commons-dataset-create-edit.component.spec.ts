import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatBadgeModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTreeModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
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
import { UserPermission } from '../commons-types';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FormFieldLabelComponent } from '../form-field-label/form-field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { mockDataset } from '../shared/fixtures/dataset';
import { mockIrbInvestigators } from '../shared/fixtures/investigators';
import { mockIrbNumbers } from '../shared/fixtures/irb';
import { mockProject } from '../shared/fixtures/project';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { TreeSelectComponent } from '../tree-select/tree-select.component';
import { CommonsDatasetCreateEditComponent } from './commons-dataset-create-edit.component';

describe('CommonsDatasetCreateEditComponent', () => {
  let httpMock: HttpTestingController;
  let component: CommonsDatasetCreateEditComponent;
  let fixture: ComponentFixture<CommonsDatasetCreateEditComponent>;
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        CommonsDatasetCreateEditComponent,
        ErrorMessageComponent,
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
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatRadioModule,
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
    fixture = TestBed.createComponent(CommonsDatasetCreateEditComponent);
    component = fixture.componentInstance;

    component.user = mockUser;
    component.currentForm = 'commons-dataset-create-edit';
    component.previousForm = 'commons-dataset-create-edit';
    component.project = mockProject;
    component.dataset = mockDataset;

    fixture.detectChanges();

    const irbNumbersReq = httpMock.expectOne(`undefined/commons/permissions/user/irb_protocols`);
    expect(irbNumbersReq.request.method).toEqual('GET');
    irbNumbersReq.flush(mockIrbNumbers);
    expect(component.irbNumbers).toEqual(mockIrbNumbers);

    const irbInvestigatorsReq = httpMock.expectOne(`undefined/commons/permissions/datasets/investigators/${mockDataset.id}`);
    expect(irbInvestigatorsReq.request.method).toEqual('GET');
    irbInvestigatorsReq.flush(mockIrbInvestigators);
    expect(component.irbInvestigators).toEqual(mockIrbInvestigators);
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate list of IRB study numbers', () => {
    const optionsElements = component.fields.study_irb_number.selectOptionsMap;
    expect(optionsElements.length).toEqual(mockIrbNumbers.length);
  });

  it('should build user permission map', () => {
    const emptyUserPermission = {
      user_email: '',
      user_role: '',
    };

    const emptyUserPermissionMap = (component as any).buildUserPermissionMap(emptyUserPermission);
    expect(emptyUserPermissionMap.userPermission).toEqual(emptyUserPermission);
    expect(emptyUserPermissionMap.isDataset).toEqual(true);
    expect(emptyUserPermissionMap.hasIrbNumber).toEqual(true);
    expect(emptyUserPermissionMap.irbInvestigators).toEqual(mockIrbInvestigators);

    const mockUserPermission = <UserPermission>{
      user_email: mockUser.email,
      user_role: mockUser.role,
    };

    const userPermissionMap = (component as any).buildUserPermissionMap(mockUserPermission);
    expect(userPermissionMap.userPermission).toEqual(mockUserPermission);
    expect(userPermissionMap.isDataset).toEqual(true);
    expect(userPermissionMap.hasIrbNumber).toEqual(true);
    expect(userPermissionMap.irbInvestigators).toEqual(mockIrbInvestigators);
  });
});
