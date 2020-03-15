import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User } from '../user';
import { Resource } from '../resource';

@Component({
  selector: 'app-commons-project',
  templateUrl: './commons-project.component.html',
  styleUrls: ['./commons-project.component.scss']
})
export class CommonsProjectComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() project: Resource;
  constructor() {}

  ngOnInit() {}

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-projects-list' });
  }

  showProject() {
    this.currentFormChange.emit({
      previousForm: 'commons-project',
      displayForm: 'commons-project-create-edit'
    });
  }

  showDataset() {
    this.currentFormChange.emit({
      displayForm: 'commons-dataset-create-edit'
    });
  }
}
