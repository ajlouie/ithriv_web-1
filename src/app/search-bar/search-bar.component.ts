import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../category';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { User } from '../user';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  categories: Category[] = [];
  user: User;
  publicpage: boolean;
  @Input() isExpanded: boolean;

  constructor(
    private api: ResourceApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loadUser();
    this.loadCategories();

    this.route.queryParamMap.subscribe(params => {
      if (params.has('publicpage')) {
        this.publicpage = !!(params.get('publicpage'));
      }
    });
  }

  ngOnInit() {
  }

  loadCategories() {
    this.api.getRootCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadUser() {
    this.api.getSession().subscribe(user => {
      this.user = user;
    });
  }

  goCategory(category: Category) {
    const viewPrefs = this.api.getViewPreferences();
    const isNetworkView =
      viewPrefs && viewPrefs.hasOwnProperty('isNetworkView')
        ? viewPrefs.isNetworkView
        : true;
    const catId = category.id.toString();

    if (isNetworkView) {
      this.router.navigate(['network', catId]);
    } else {
      this.router.navigate(['browse', catId]);
    }
  }
}
