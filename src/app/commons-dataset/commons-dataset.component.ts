import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';
import { Dataset, UserPermission, DatasetFileVersion } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { Observable } from 'rxjs';
import { CommonsDatasetCreateEditComponent } from '../commons-dataset-create-edit/commons-dataset-create-edit.component';

@Component({
  selector: 'app-commons-dataset',
  templateUrl: './commons-dataset.component.html',
  styleUrls: ['./commons-dataset.component.scss'],
})
export class CommonsDatasetComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() dataset: Dataset;
  userPermissionsTeam$: Observable<UserPermission[]> | undefined;
  userPermissionsCustomer$: Observable<UserPermission[]> | undefined;
  fileVersions$: Observable<DatasetFileVersion[]> | undefined;
  displayedUserpermColumns: string[] = ['email', 'role'];
  displayedFileVersionColumns: string[] = [
    'file_version',
    'creator',
    'create_date_time',
    'download',
  ];

  constructor(public cas: CommonsApiService) {}

  ngOnInit() {
    this.loadPermisssions();
    this.loadFileVersions();
  }

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-project' });
  }

  showDataset() {
    this.currentFormChange.emit({
      currentDataset: this.dataset,
      previousForm: 'commons-dataset',
      displayForm: 'commons-dataset-create-edit',
    });
  }

  onFileComplete(data: any) {
    this.dataset.url = data.url;
    this.dataset.filename = data.fileName;
    this.loadFileVersions();
    console.log(data);
  }

  uploadUrl() {
    return (
      this.cas.getLandingServiceUrl(this.user) +
      `/commons/data/datasets/file/${this.dataset.id}`
    );
  }

  loadPermisssions() {
    this.userPermissionsTeam$ = this.cas.getDatasetPermissionsTeam(
      this.user,
      this.dataset
    );
    this.userPermissionsCustomer$ = this.cas.getDatasetPermissionsCustomer(
      this.user,
      this.dataset
    );
  }

  loadFileVersions() {
    this.fileVersions$ = this.cas.getDatasetFileVersions(
      this.user,
      this.dataset
    );
  }

  lookupRole(lookupKey: String) {
    let i;
    for (
      i = 0;
      i < CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC.length;
      i++
    ) {
      if (
        CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC[i]['key'] ===
        lookupKey.toString()
      ) {
        return CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC[i][
          'value'
        ];
      }
    }
  }

  toggleDatasetPrivate(dataset: Dataset, isPrivate: boolean) {
    dataset.private = isPrivate;
    this.cas.updateDataset(dataset).subscribe(
      (e) => {
        this.dataset = e;
      },
      (error1) => {}
    );
  }

  toggleDatasetDataPrivate(dataset: Dataset, isPrivate: boolean) {
    // dataset.private_data = isPrivate;
    // this.cas.updateDataset(dataset).subscribe(
    //   (e) => {
    //     this.dataset = e;
    //   },
    //   (error1) => {}
    // );
  }

  keywords() {
    const keyswordsArray = this.dataset.keywords.split(',');
    return keyswordsArray;
  }
}
