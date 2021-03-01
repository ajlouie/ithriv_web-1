import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../commons-types';

@Component({
  selector: 'app-commons-project-actions',
  templateUrl: './commons-project-actions.component.html',
  styleUrls: ['./commons-project-actions.component.scss']
})
export class CommonsProjectActionsComponent implements OnInit {
  @Input() project: Project;
  @Output() deleteClicked = new EventEmitter<boolean>();
  showConfirmDelete = false;
  createNew = false;

  constructor() {
  }

  ngOnInit() {
    this.createNew = (
      this.project === undefined ||
      this.project.id === undefined ||
      this.project.id === ''
    );
  }
}
