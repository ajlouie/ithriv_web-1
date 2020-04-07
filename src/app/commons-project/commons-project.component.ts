import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../user';
import { Project, Dataset } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { Observable } from 'rxjs';

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

  constructor(private cas: CommonsApiService) {}

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
      url: '',
      filename: '',
    };
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
}
