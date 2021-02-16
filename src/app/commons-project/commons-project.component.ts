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
    'can_update_meta',
    'can_download_data',
    'can_upload_data',
    'can_delete_data',
    'can_restore_data',
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
      dataset_type: 'Generic',
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
      variable_measured: '',
      license : '',
      spatial_coverage_address: '',
      temporal_coverage_date: null,
      study_irb_number: '',
      approved_irb_link: '',
      contract_link: '',
      link_to_external_dataset: '',
      dicom_de_identified: '',
      dicom_bids_structure: '',
      dicom_quality: '',
      dicom_study_date: '',
      dicom_scanner_manufacturer_name: '',
      dicom_scanner_model_name: '',
      dicom_organ_name: '',
      dicom_fieldof_view: '',
      dicom_field_strength: '',
      redcap_project_url: '',
      redcap_extract_data: '',
      redcap_refresh_rate: 1,
      redcap_report_id: '',
      redcap_project_token: '',
      redcap_project_title: '',
      redcap_project_pi: ''
    };
    this.loadPermisssions();
  }
  userCanEditHsd(dataset: Dataset): boolean {
    if (!dataset.hasOwnProperty('is_hsd')) {
      return dataset.is_hsd;
    } else {
      return true;
    }
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
      return [];
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
    // console.log(data);
  }

  togglePrivate(isPrivate: boolean) {
    this.project.private = isPrivate;
    this.cas.updateProject(this.project).subscribe(
      (e) => {
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

  restoreDatasetData(dataset) {
    this.cas.restoreDatasetData(dataset, this.user).subscribe(
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
          (error1) => {
            console.log(error1);
          }
        );
      },
      (error1) => {
        console.log(error1);
      }
    );
    // console.log(document);
  }

  deleteDatasetData(dataset) {
    this.cas.deleteDatasetData(dataset, this.user).subscribe(
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
          (error1) => {
            console.log(error1);
          }
        );
      },
      (error1) => {
        console.log(error1);
      }
    );
    // console.log(document);
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
    // console.log(document);
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
    // console.log(document);
  }
}
