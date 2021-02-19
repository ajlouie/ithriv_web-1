import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
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
  styleUrls: ['./consult-request-form.component.scss'],
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
      selectOptions: [],
    }),
    // request_type: new FormField({
    //   formControl: new FormControl(),
    //   required: true,
    //   placeholder: 'Pick the type that best represents your request:',
    //   type: 'select',
    //   selectOptions: ['Inquiry', 'Feedback', 'Unmet Need'],
    // }),
    request_title: new FormField({
      formControl: new FormControl(),
      required: true,
      placeholder:
        'Please provide an issue summary for which you are requesting a consult:',
      type: 'textarea',
      maxLength: 100,
      options: {
        status: ['words'],
      },
    }),
    request_text: new FormField({
      formControl: new FormControl(),
      required: true,
      placeholder:
        'Please describe the issue for which you are requesting a consult:',
      type: 'textarea',
      options: {
        status: ['words'],
      },
    }),
  };
  iThrivForm = new IThrivForm(this.fields, this.requestConsultForm);

  dataSource: ConsultRequestDataSource = new ConsultRequestDataSource(this.api);
  displayedColumns = [
    'reference_id',
    'request_type',
    'summary',
    'status',
    'create_date',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('input', { static: false }) input: ElementRef;
  default_page_size = 5;

  constructor(
    private router: Router,
    private api: ResourceApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.api.getConsultCategoryList().subscribe((categoryList) => {
      this.fields['request_category'] = new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Pick the category that best represents your request:',
        type: 'select',
        selectOptions: categoryList,
      });
      this.iThrivForm.loadForm();
    });
  }

  ngOnInit() {
    this.dataSource = new ConsultRequestDataSource(this.api);
    this.api.getSession().subscribe((user) => {
      this.user = user;
      this.dataSource.loadConsultRequests(this.user, 0, this.default_page_size);
      this.ngAfterViewInit();
    });
  }

  ngAfterViewInit() {
    this.api.getSession().subscribe(user => {
      if (this.paginator && this.paginator.page) {
        this.paginator.page
          .pipe(tap(() => this.loadConsultRequests()))
          .subscribe();
      }
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
        'Inquiry',
        this.fields.request_title.formControl.value,
        this.fields.request_text.formControl.value
      )
      .subscribe(
        (e) => {
          this.errorMessage = '';
          this.dataSource.loadConsultRequests(
            this.user,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
          this.formStatus = 'complete';
        },
        (error1) => {
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

  showConsultRequestForm() {
    this.iThrivForm.reset();
    this.formStatus = 'form';
  }
}
