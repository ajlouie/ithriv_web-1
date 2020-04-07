import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { Project, Dataset } from '../commons-types';
import { Observable } from 'rxjs';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';

@Component({
  selector: 'app-commons-home',
  templateUrl: './commons-home.component.html',
  styleUrls: ['./commons-home.component.scss']
})
export class CommonsHomeComponent implements OnInit {
  @Input() user: User;
  @Input() formStatus;
  projectCreateEditPrevForm = 'commons-projects-list';
  currentProject: Project;
  currentDataset: Dataset;
  projectDataPrivate$: Observable<Project[]> | undefined;
  projectDataPublic$: Observable<Project[]> | undefined;
  datasetDataPrivate$: Observable<Dataset[]> | undefined;
  datasetDataPublic$: Observable<Dataset[]> | undefined;

  constructor(private cas: CommonsApiService) {}

  ngOnInit() {
    this.projectDataPrivate$ = this.cas.loadPrivateProjects();
    this.projectDataPublic$ = this.cas.loadPublicProjects();
  }

  updateStatus(event) {
    this.formStatus = event.displayForm;
    if (event.currentProject !== undefined) {
      this.currentProject = event.currentProject;
    }

    if (this.currentProject !== undefined) {
      this.datasetDataPrivate$ = this.cas.loadPrivateDatasets(
        this.currentProject.id
      );
      this.datasetDataPublic$ = this.cas.loadPublicDatasets(
        this.currentProject.id
      );
    }
    if (event.currentDataset !== undefined) {
      this.currentDataset = event.currentDataset;
    }
    if (event.previousForm !== undefined) {
      this.projectCreateEditPrevForm = event.previousForm;
    } else {
      this.projectCreateEditPrevForm = 'commons-projects-list';
    }
  }
}
