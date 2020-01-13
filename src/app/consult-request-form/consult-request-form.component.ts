import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMatcher } from '../error-matcher';
import { FormField } from '../form-field';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { IThrivForm } from '../shared/IThrivForm';
import { User } from '../user';

import { ConsultRequestDataSource } from '../consult-request-data-source';
import { MatPaginator, MatSort } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-consult-request-form',
  templateUrl: './consult-request-form.component.html',
  styleUrls: ['./consult-request-form.component.scss']
})
export class ConsultRequestFormComponent implements AfterViewInit, OnInit {
  user: User;
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  requestConsultForm: FormGroup = new FormGroup({});
  formStatus = 'form';

  fields = {
    request_category: new FormField({
      formControl: new FormControl(),
      required: true,
      placeholder: 'Pick the category that best represents your request:',
      type: 'select',
      selectOptions: [
        'Research Concierge Services',
        'Translational Research Ethics Consults (T-RECS)',
        'Electronic Data Capture',
        'Medical Record Data Pull',
        'Informatics Tools',
        'Community Studios',
        'Community Seed Grants',
        'Find Community Research Collaborators',
        'Find Team Science Research Collaborators',
        'Team Science Seed Grant',
        'Researcher Studios',
        'Biostats, Epidemiology, and Research Design',
        'General Regulatory Support',
        'Recruitment Enhancement',
        'Multi-Center Study Management',
        'Investigator Initiated Trials',
        'iTHRIV Scholars'
      ]
    }),
    request_type: new FormField({
      formControl: new FormControl(),
      required: true,
      placeholder: 'Pick the type that best represents your request:',
      type: 'select',
      selectOptions: ['Inquiry', 'Feedback', 'Unmet Need']
    }),
    request_title: new FormField({
      formControl: new FormControl(),
      required: false,
      placeholder:
        'Please provide an issue summary for which you are requesting a consult:',
      type: 'textarea',
      options: {
        status: ['words']
      }
    }),
    request_text: new FormField({
      formControl: new FormControl(),
      required: true,
      placeholder:
        'Please describe the issue for which you are requesting a consult:',
      type: 'textarea',
      options: {
        status: ['words']
      }
    })
  };
  iThrivForm = new IThrivForm(this.fields, this.requestConsultForm);

  dataSource: ConsultRequestDataSource = new ConsultRequestDataSource(this.api);
  displayedColumns = [
    'reference_id',
    'request_type',
    'summary',
    'status',
    'create_date'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;
  default_page_size = 5;

  constructor(
    private router: Router,
    private api: ResourceApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.iThrivForm.loadForm();
  }

  ngOnInit() {
    this.dataSource = new ConsultRequestDataSource(this.api);
    this.api.getSession().subscribe(user => {
      this.user = user;
      this.dataSource.loadConsultRequests(this.user, 0, this.default_page_size);
      this.ngAfterViewInit();
    });
    // this.api.getConsultCategoryList().subscribe(categoryList => {
    //   this.fields['request_category'] = new FormField({
    //     formControl: new FormControl(),
    //     required: true,
    //     placeholder: 'Pick the category that best represents your request:',
    //     type: 'select',
    //     selectOptions: categoryList
    //   });
    // });
  }

  ngAfterViewInit() {
    this.api.getSession().subscribe(user => {
      this.paginator.page
        .pipe(tap(() => this.loadConsultRequests()))
        .subscribe();
    });
  }

  getFields() {
    return this.iThrivForm.getFields();
  }

  onSubmit() {
    this.iThrivForm.validate();
    if (!this.requestConsultForm.valid) {
      return;
    }
    this.formStatus = 'submitting';

    this.api
      .sendConsultRequestToJIRA(
        this.user,
        this.fields.request_category.formControl.value,
        this.fields.request_type.formControl.value,
        this.fields.request_title.formControl.value,
        this.fields.request_text.formControl.value
      )
      .subscribe(
        e => {
          this.dataSource.loadConsultRequests(
            this.user,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
          this.formStatus = 'complete';
        },
        error1 => {
          if (error1) {
            this.errorMessage = error1;
          }
          this.formStatus = 'form';
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  onCancel() {
    this.router.navigate(['']);
  }

  loadConsultRequests() {
    this.dataSource.loadConsultRequestsByPage(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
