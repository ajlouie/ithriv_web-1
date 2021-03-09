import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { CommonsDatasetCreateEditComponent } from '../commons-dataset-create-edit/commons-dataset-create-edit.component';
import { CommonsState, Dataset, DatasetFileVersion, UserPermission } from '../commons-types';
import {
  HsdDownloadDialogComponent,
  HsdDownloadDialogData
} from '../hsd-download-dialog/hsd-download-dialog.component';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { User } from '../user';

@Component({
  selector: 'app-commons-dataset',
  templateUrl: './commons-dataset.component.html',
  styleUrls: ['./commons-dataset.component.scss'],
})
export class CommonsDatasetComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter<CommonsState>();
  @Input() dataset: Dataset;
  userPermissionsTeam$: Observable<UserPermission[]> | undefined;
  userPermissionsCustomer$: Observable<UserPermission[]> | undefined;
  fileVersions$: Observable<DatasetFileVersion[]> | undefined;
  isConnected = false;
  displayedUserpermColumns: string[] = ['email', 'role'];
  displayedFileVersionColumns: string[] = [
    'file_version',
    'creator',
    'create_date_time',
    'download',
  ];

  constructor(public cas: CommonsApiService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadPermisssions();
    this.loadFileVersions();
    this.cas.testSSO().subscribe(add => {
      if (add.sum === '300') {
        this.isConnected = true;
      }
    });
  }

  showNext() {
    this.currentFormChange.emit({displayForm: 'commons-project'});
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
      (error1) => {
      }
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

  downloadFile(url: string, filename: string, user: User) {
    const doIt = () => {
      this.cas.downloadFile(
        url,
        filename,
        user,
      );
    };

    if (this.userCanEditHsd(this.dataset)) {
      if (this.dataset.is_hsd) {
        // Open confirmation dialog first.
        const dialogRef = this.dialog.open(HsdDownloadDialogComponent, {
          height: '300px',
          width: '500px',
          data: {
            dataset: this.dataset,
            confirm: false,
          },
        });

        dialogRef.afterClosed().subscribe((data: HsdDownloadDialogData) => {
          if (data.confirm) {
            doIt();
          }
        });
      } else {
        doIt();
      }
    }
  }

  private userCanEditHsd(dataset: Dataset) {
    if (dataset.hasOwnProperty('is_locked_for_user')) {
      return !dataset.is_locked_for_user;
    } else {
      return true;
    }
  }
}
