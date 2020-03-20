import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';
import { Project } from '../commons-types';

@Component({
  selector: 'app-commons-menu',
  templateUrl: './commons-menu.component.html',
  styleUrls: ['./commons-menu.component.scss']
})
export class CommonsMenuComponent implements OnInit {
  @Input() user: User;
  @Output() currentFormChange = new EventEmitter();
  @Input() currentForm: String;
  project: Project;

  constructor() {
    this.project = <Project>{
      id: '',
      collab_mgmt_service_id: '',
      name: '',
      name_alts: '',
      pl_pi: '',
      description: '',
      keywords: '',
      funding_source: '',
      ithriv_partner: '',
      other_partner: ''
    };
  }

  ngOnInit() {}

  showNext() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-projects-list',
      displayForm: 'commons-project-create-edit'
    });
  }
}
