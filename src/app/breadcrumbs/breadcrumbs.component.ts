import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../commons-types';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() navItems: NavItem[];

  constructor() { }

  ngOnInit() {
  }

}
