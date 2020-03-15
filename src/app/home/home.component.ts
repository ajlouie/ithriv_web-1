import {
  Component,
  Input,
  OnInit,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../category';
import { Resource } from '../resource';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ResourceQuery } from '../resource-query';
import { fadeTransition } from '../shared/animations';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user';
import { Institution } from '../institution';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeTransition()]
})
export class HomeComponent implements OnInit {
  @HostBinding('@fadeTransition')
  @Input()
  resourceQuery: ResourceQuery;
  publicpage: Boolean;
  searchForm: FormGroup;
  searchBox: FormControl;
  loading = false;
  resources: Resource[];
  events: Array<Resource> = [];
  categories: Category[];
  user: User;
  institution: Institution;
  panelOpenState = true;
  url: string = 'http://localhost:4200/#/commons';
  urlSafe: SafeResourceUrl;

  constructor(
    private api: ResourceApiService,
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
    this.loadUser();
    this.categories = [];

    this.api.getRootCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.api.getResources().subscribe(resources => {
      this.resources = resources;
    });

    this.api.getResources('Event').subscribe(events => {
      events.forEach(event => {
        const user = this.user;
        event.availabilities.forEach(availability => {
          if (this.user !== undefined && this.user !== null) {
            if (
              availability.institution.description ===
              this.user.institution.description
            ) {
              this.events.push(event);
            }
          } else {
            if (availability.institution.description === 'Public') {
              this.events.push(event);
            }
          }
        });
      });
    });

    this.publicpage = false;
  }

  ngOnInit() {
    this.searchBox = new FormControl();
    this.searchForm = new FormGroup({
      searchBox: this.searchBox
    });
    this.route.queryParamMap.subscribe(params => {
      if (params.has('publicpage')) {
        this.publicpage = Boolean(params.get('publicpage'));
      }
    });
    // const projectstoken = localStorage.getItem('token');
    // if (!projectstoken) {
    //  this.api.getProjectsSession().subscribe(user => {
    //  this.user = user;
    //  this.getInstitution();
    //});
    // this.api.loginProjectsAdapter().subscribe(token => {
    //   this.api.openProjectsSession(token).subscribe(user => {
    //     this.user = user;
    //     this.getInstitution();
    //   });
    // });
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  loadUser() {
    this.api.getSession().subscribe(user => {
      this.user = user;
      this.getInstitution();
    });
  }

  getInstitution() {
    if (sessionStorage.getItem('institution_id')) {
      this.api
        .getInstitution(parseInt(sessionStorage.getItem('institution_id'), 10))
        .subscribe(inst => {
          this.institution = inst;
        });
    }
  }

  goSearch() {
    this.router.navigate(['search', this.searchBox.value]);
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
