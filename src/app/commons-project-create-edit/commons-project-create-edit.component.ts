import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-commons-project-create-edit',
  templateUrl: './commons-project-create-edit.component.html',
  styleUrls: ['./commons-project-create-edit.component.scss']
})
export class CommonsProjectCreateEditComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Input() previousForm: String;
  @Output() currentFormChange = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  submitProject() {
    this.showNext();
  }
  cancelProject() {
    this.showNext();
  }

  showNext() {
    this.currentFormChange.emit({ displayForm: this.previousForm });
  }
}
