import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-commons-dataset-create-edit',
  templateUrl: './commons-dataset-create-edit.component.html',
  styleUrls: ['./commons-dataset-create-edit.component.scss']
})
export class CommonsDatasetCreateEditComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  submitDataset() {
    this.showNext();
  }
  cancelDataset() {
    this.showNext();
  }

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-project' });
  }
}
