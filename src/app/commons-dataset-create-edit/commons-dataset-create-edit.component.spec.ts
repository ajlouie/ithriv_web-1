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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileDropModule } from 'ngx-file-drop';
import { MarkdownModule } from 'ngx-markdown';
import { NgProgressModule } from 'ngx-progressbar';
import { UserPermission } from '../commons-types';
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
        CommonsDatasetCreateEditComponent,
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
    component.currentForm = '';
    component.previousForm = '';
    component.project = mockProject;
    component.dataset = mockDataset;

    fixture.detectChanges();

    const irbNumbersReq = httpMock.expectOne(`undefined/commons/meta/user/${mockUser.email}/irb_protocols`);
    expect(irbNumbersReq.request.method).toEqual('GET');
    irbNumbersReq.flush(mockIrbNumbers);

    const irbInvestigatorsReq = httpMock.expectOne(`undefined/commons/meta/datasets/${mockDataset.id}/investigators`);
    expect(irbInvestigatorsReq.request.method).toEqual('GET');
    irbInvestigatorsReq.flush(mockIrbInvestigators);
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate list of investigators', () => {
    expect(component.irbInvestigators).toEqual(mockIrbInvestigators);
  });

  it('should populate list of IRB study numbers', () => {
    expect(component.irbNumberOptions.length).toEqual(mockIrbNumbers.length);

    for (let i = 0; i < mockIrbNumbers.length; i++) {
      expect(component.irbNumberOptions[i].id).toEqual(mockIrbNumbers[i].study_id);
      expect(component.irbNumberOptions[i].name).toEqual(mockIrbNumbers[i].study_id);
    }
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
