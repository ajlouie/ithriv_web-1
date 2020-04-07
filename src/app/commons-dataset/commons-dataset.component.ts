import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';
import { Dataset } from '../commons-types';

@Component({
  selector: 'app-commons-dataset',
  templateUrl: './commons-dataset.component.html',
  styleUrls: ['./commons-dataset.component.scss'],
})
export class CommonsDatasetComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() dataset: Dataset;

  constructor() {}

  ngOnInit() {}

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-project' });
  }

  showDataset() {
    this.currentFormChange.emit({
      currentDataset: this.dataset,
      previousForm: 'commons-dataset',
      displayForm: 'commons-dataset-create-edit',
    });
  }
}
