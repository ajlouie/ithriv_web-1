import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatButtonModule,
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonsFileUploadComponent } from '../commons-file-upload/commons-file-upload.component';
import { mockDocument } from '../shared/fixtures/document';
import { mockProject } from '../shared/fixtures/project';
import { mockUser } from '../shared/fixtures/user';
import { CommonsProjectDocumentComponent } from './commons-project-document.component';

describe('CommonsProjectDocumentComponent', () => {
  let component: CommonsProjectDocumentComponent;
  let fixture: ComponentFixture<CommonsProjectDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommonsFileUploadComponent,
        CommonsProjectDocumentComponent,
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: mockUser,
            project: mockProject,
            document: mockDocument,
          }
        },

      ]
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
