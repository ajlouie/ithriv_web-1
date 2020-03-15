import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-commons-menu',
  templateUrl: './commons-menu.component.html',
  styleUrls: ['./commons-menu.component.scss']
})
export class CommonsMenuComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Output() currentFormChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-project-create-edit' });
  }
}
