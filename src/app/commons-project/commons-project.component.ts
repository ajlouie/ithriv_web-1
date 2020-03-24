import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../user';
import { Project } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';

@Component({
  selector: 'app-commons-project',
  templateUrl: './commons-project.component.html',
  styleUrls: ['./commons-project.component.scss']
})
export class CommonsProjectComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() project: Project;
  constructor(private cas: CommonsApiService) {}

  ngOnInit() {}

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-projects-list' });
  }

  showProject() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-project',
      displayForm: 'commons-project-create-edit'
    });
  }

  showDataset() {
    this.currentFormChange.emit({
      displayForm: 'commons-dataset-create-edit'
    });
  }

  togglePrivate(isPrivate: boolean) {
    this.project.private = isPrivate;
    this.cas.updateProject(this.project).subscribe(
      e => {
        this.project = e;
      },
      error1 => {}
    );
  }

  keywords() {
    const keyswordsArray = this.project.keywords.split(',');
    return keyswordsArray;
  }
}
