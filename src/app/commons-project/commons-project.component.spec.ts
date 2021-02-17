import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCardModule, MatChipsModule, MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule, MatListModule, MatProgressBarModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { CommonsFileUploadComponent } from '../commons-file-upload/commons-file-upload.component';
import { mockDataset } from '../shared/fixtures/dataset';
import { mockProject } from '../shared/fixtures/project';
import { mockUser } from '../shared/fixtures/user';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';

import { CommonsProjectComponent } from './commons-project.component';

describe('CommonsProjectComponent', () => {
  let component: CommonsProjectComponent;
  let fixture: ComponentFixture<CommonsProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommonsFileUploadComponent,
        CommonsProjectComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MarkdownModule,
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
      ],
      providers: [
        { provide: MarkdownService, useClass: MockMarkdownService },
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.currentForm = '';
    component.project = mockProject;
    component.datasetsPrivate = [mockDataset];
    component.datasetsPublic = [mockDataset];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
