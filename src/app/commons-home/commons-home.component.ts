import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { Resource } from '../resource';

@Component({
  selector: 'app-commons-home',
  templateUrl: './commons-home.component.html',
  styleUrls: ['./commons-home.component.scss']
})
export class CommonsHomeComponent implements OnInit {
  @Input() user: User;
  @Input() formStatus;
  @Input() projects: Resource[];
  projectCreateEditPrevForm = 'commons-projects-list';
  currentProject: Resource;

  constructor() {}

  ngOnInit() {}

  updateStatus(event) {
    this.formStatus = event.displayForm;
    if (event.currentProject !== undefined) {
      this.currentProject = event.currentProject;
    }
    if (event.previousForm !== undefined) {
      this.projectCreateEditPrevForm = event.previousForm;
    } else {
      this.projectCreateEditPrevForm = 'commons-projects-list';
    }
  }
}
