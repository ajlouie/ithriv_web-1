import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonsHomeComponent } from '../commons-home/commons-home.component';
import { CommonsStateForm } from '../commons-types';
import { Institution } from '../institution';
import { Resource } from '../resource';
import { ResourceQuery } from '../resource-query';
import { fadeTransition } from '../shared/animations';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeTransition()]
})
export class HomeComponent implements OnInit {
  @HostBinding('@fadeTransition')
  @Input() resourceQuery: ResourceQuery;
  publicpage: Boolean;
  searchForm: FormGroup;
  searchBox: FormControl;
  loading = false;
  resources: Resource[];
  events: Array<Resource> = [];
  user: User;
  institution: Institution;
  url = 'http://localhost:4200/#/commons';
  urlSafe: SafeResourceUrl;
  tabIndex = 0;
  formStatus: CommonsStateForm = 'commons-projects-list';

  @ViewChild('commonsHome', { static: false }) commonsHomeComponent: CommonsHomeComponent;


  constructor(
    private api: ResourceApiService,
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
    this.route.queryParamMap.subscribe(queryParamMap => {
      if (queryParamMap.has('tabIndex')) {
        const tabIndex = queryParamMap.get('tabIndex');
        if (/^[0-9]+$/.test(tabIndex)) {
          this.tabIndex = parseInt(tabIndex, 10);
        }
      }
    });

    this.loadUser();

    this.api.getResources().subscribe(resources => {
      this.resources = resources;
    });

    this.api.getResources('Event').subscribe(events => {
      events.forEach(event => {
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

  updateRouteTabIndex(selectedIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tabIndex: selectedIndex},
    });
  }

  handleFormStatusTabChange() {
    if (this.commonsHomeComponent && this.tabIndex === 3) {
      this.commonsHomeComponent.updateStatus({displayForm: 'commons-projects-list'});
    }
  }
}
