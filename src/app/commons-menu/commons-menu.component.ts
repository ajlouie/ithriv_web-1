import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatInput, MatPaginator, MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Filter, ResourceQuery } from '../resource-query';
import { fadeTransition } from '../shared/animations';
import { User } from '../user';
import { Project } from '../commons-types';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { IThrivForm } from '../shared/IThrivForm';
import { Fieldset } from '../fieldset';
import { FormField } from '../form-field';
import { ErrorMatcher } from '../error-matcher';

@Component({
  selector: 'app-commons-menu',
  templateUrl: './commons-menu.component.html',
  styleUrls: ['./commons-menu.component.scss'],
})
export class CommonsMenuComponent implements OnInit {
  @Input() user: User;
  @Output() currentFormChange = new EventEmitter();
  @Input() currentForm: String;
  project: Project;

  fields: any = {};
  fieldsets: Fieldset[] = [];
  fg: FormGroup;
  iThrivForm: IThrivForm;
  searchOptions = ['Search Projects and Datasets'];
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  error: string;

  constructor(fb: FormBuilder, private api: CommonsApiService) {
    this.project = <Project>{
      id: '',
      collab_mgmt_service_id: '',
      name: '',
      name_alts: '',
      pl_pi: '',
      description: '',
      keywords: '',
      funding_source: '',
      ithriv_partner: '',
      other_partner: '',
    };
    // this.loadFields();
    // this.fg = fb.group(this.fields);
    // this.iThrivForm = new IThrivForm(this.fields, this.fg);
  }

  ngOnInit() {}

  loadFields() {
    this.fields = {
      search_options: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Partner iTHRIV Institutions:',
        type: 'select',
        selectOptions: this.searchOptions,
      }),
      other_partner: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Other Partner Institutions:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
    };
  }

  getFields() {
    return this.iThrivForm.getFields();
  }

  showNext() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-projects-list',
      displayForm: 'commons-project-create-edit',
    });
  }

  doSearch() {
    // this.api.searchResources(this.resourceQuery).subscribe((query) => {
    //   this.loading = false;
    //   this.resourceQuery = query;
    //   this.resources = query.resources;
    //   this.checkWindowWidth();
    // });
  }

  updatePage() {}
}
