import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule, MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { FileDropModule } from 'ngx-file-drop';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { NgProgressModule } from 'ngx-progressbar';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { CommonsFileUploadComponent } from '../commons-file-upload/commons-file-upload.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { mockDataset } from '../shared/fixtures/dataset';
import { mockUser } from '../shared/fixtures/user';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';
import { CommonsDatasetComponent } from './commons-dataset.component';

describe('CommonsDatasetComponent', () => {
  let component: CommonsDatasetComponent;
  let fixture: ComponentFixture<CommonsDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        CommonsDatasetComponent,
        CommonsFileUploadComponent,
        FileUploadComponent,
      ],
      imports: [
        FileDropModule,
        HttpClientTestingModule,
        MarkdownModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        NgProgressModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: MarkdownService, useClass: MockMarkdownService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsDatasetComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.currentForm = '';
    component.dataset = mockDataset;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
