import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { User } from '../user';
import {
  Project,
  Dataset,
  ProjectDocumentMap,
  ProjectDocument,
  UserPermission,
} from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import fileSaver from 'file-saver';
import { CommonsProjectDocumentComponent } from '../commons-project-document/commons-project-document.component';
import { CommonsProjectCreateEditComponent } from '../commons-project-create-edit/commons-project-create-edit.component';

@Component({
  selector: 'app-commons-project',
  templateUrl: './commons-project.component.html',
  styleUrls: ['./commons-project.component.scss'],
})
export class CommonsProjectComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() project: Project;
  @Input() datasetsPrivate: Dataset[];
  @Input() datasetsPublic: Dataset[];
  dataset: Dataset;
  userPermissions$: Observable<UserPermission[]> | undefined;
  displayedUserpermColumns: string[] = ['email', 'role'];
  displayedColumns: string[] = [
    'name',
    'last_modified',
    'private',
    'can_download_data',
    'can_upload_data',
    'can_update_meta',
  ];
  displayedDocumentColumns: string[] = [
    'name',
    'type',
    'last_modified',
    'url',
    'update',
    'delete',
    'restore',
  ];

  constructor(
    public cas: CommonsApiService,
    private http: HttpClient,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataset = <Dataset>{
      id: '',
      project_id: this.project.id,
      name: '',
      description: '',
      keywords: '',
      identifiers_hipaa: '',
      other_sensitive_data: '',
      last_modified: '',
      private: true,
      private_data: true,
      url: '',
      filename: '',
    };
    this.loadPermisssions();
  }

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-projects-list' });
  }

  showProject() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-project',
      displayForm: 'commons-project-create-edit',
    });
  }

  showDataset(dataset) {
    this.currentFormChange.emit({
      currentDataset: dataset,
      previousForm: 'commons-project',
      displayForm: 'commons-dataset-create-edit',
    });
  }

  viewDataset(dataset) {
    this.currentFormChange.emit({
      currentDataset: dataset,
      displayForm: 'commons-dataset',
    });
  }

  getDataSource() {
    if (this.datasetsPrivate == null && this.datasetsPublic == null) {
      return []
    } else {
      return <Dataset[]>[].concat(this.datasetsPrivate, this.datasetsPublic);
    }
  }

  onFileComplete(data: any) {
    this.cas.updateProject(this.project).subscribe(
      (e) => {
        this.project = e;
        this.currentFormChange.emit({
          currentProject: this.project,
          previousForm: 'commons-project',
          displayForm: 'commons-project',
        });
      },
      (error1) => {}
    );
    console.log(data);
  }

  togglePrivate(isPrivate: boolean) {
    this.project.private = isPrivate;
    this.cas.updateProject(this.project).subscribe(
      (e) => {
        this.project = e;
      },
      (error1) => {}
    );
  }

  toggleDatasetPrivate(dataset: Dataset, isPrivate: boolean) {
    dataset.private = isPrivate;
    this.cas.updateDataset(dataset).subscribe(
      (e) => {},
      (error1) => {}
    );
  }

  keywords() {
    const keyswordsArray = this.project.keywords.split(',');
    return keyswordsArray;
  }

  uploadUrlDataset(dataset: Dataset) {
    return (
      this.cas.getLandingServiceUrl(this.user) +
      `/commons/data/datasets/file/${dataset.id}`
    );
  }

  lookupRole(lookupKey: String) {
    let i;
    for (
      i = 0;
      i < CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC.length;
      i++
    ) {
      if (
        CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC[i]['key'] ===
        lookupKey.toString()
      ) {
        return CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC[i][
          'value'
        ];
      }
    }
  }

  loadPermisssions() {
    this.userPermissions$ = this.cas.getProjectPermissions(
      this.user,
      this.project
    );
  }

  addDocument(): void {
    const dialogRef = this.dialog.open(CommonsProjectDocumentComponent, {
      width: '300px',
      data: <ProjectDocumentMap>{
        user: this.user,
        project: this.project,
        document: <ProjectDocument>{
          last_modified: '',
          url: '',
          filename: '',
          type: '',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.cas.updateProject(this.project).subscribe(
        (e) => {
          this.project = e;
          this.currentFormChange.emit({
            currentProject: this.project,
            previousForm: 'commons-project',
            displayForm: 'commons-project',
          });
        },
        (error1) => {}
      );
    });
  }
  updateDocument(documentType: string) {
    const dialogRef = this.dialog.open(CommonsProjectDocumentComponent, {
      width: '300px',
      data: <ProjectDocumentMap>{
        user: this.user,
        project: this.project,
        document: <ProjectDocument>{
          last_modified: '',
          url: '',
          filename: '',
          type: documentType,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.cas.updateProject(this.project).subscribe(
        (e) => {
          this.project = e;
          this.currentFormChange.emit({
            currentProject: this.project,
            previousForm: 'commons-project',
            displayForm: 'commons-project',
          });
        },
        (error1) => {}
      );
    });
  }

  restoreDocument(document) {
    this.cas.restoreDocument(this.project, document, this.user).subscribe(
      (e) => {
        this.cas.updateProject(this.project).subscribe(
          (e) => {
            this.project = e;
            this.currentFormChange.emit({
              currentProject: this.project,
              previousForm: 'commons-project',
              displayForm: 'commons-project',
            });
          },
          (error1) => {}
        );
      },
      (error1) => {}
    );
    console.log(document);
  }

  deleteDocument(document) {
    this.cas.deleteDocument(document, this.user).subscribe(
      (e) => {
        this.cas.updateProject(this.project).subscribe(
          (e) => {
            this.project = e;
            this.currentFormChange.emit({
              currentProject: this.project,
              previousForm: 'commons-project',
              displayForm: 'commons-project',
            });
          },
          (error1) => {}
        );
      },
      (error1) => {}
    );
    console.log(document);
  }
}
