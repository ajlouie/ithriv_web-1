import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { CommonsFileUploadComponent } from '../commons-file-upload/commons-file-upload.component';
import { mockDataset } from '../shared/fixtures/dataset';
import { mockProject } from '../shared/fixtures/project';
import { mockUser } from '../shared/fixtures/user';
import { CommonsProjectComponent } from './commons-project.component';

describe('CommonsProjectComponent', () => {
  let component: CommonsProjectComponent;
  let fixture: ComponentFixture<CommonsProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        CommonsFileUploadComponent,
        CommonsProjectComponent,
      ],
      imports: [
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
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterTestingModule,
      ],
      providers: [
        MarkedOptions,
        MarkdownService,
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.currentForm = 'commons-project';
    component.project = mockProject;
    component.datasetsPrivate = [mockDataset];
    component.datasetsPublic = [mockDataset];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
