import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { User } from '../user';
import { Dataset } from '../commons-types';
import { ErrorMatcher } from '../error-matcher';
import { Fieldset } from '../fieldset';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { IThrivForm } from '../shared/IThrivForm';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { FormField } from '../form-field';
import { ValidateDateTimeRange } from '../shared/validators/date_time_range.validator';
import { ValidateUrl } from '../shared/validators/url.validator';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-commons-dataset-create-edit',
  templateUrl: './commons-dataset-create-edit.component.html',
  styleUrls: ['./commons-dataset-create-edit.component.scss'],
})
export class CommonsDatasetCreateEditComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Input() previousForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() dataset: Dataset;
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  fields: any = {};
  fieldsets: Fieldset[] = [];
  files = {};
  fg: FormGroup;
  iThrivForm: IThrivForm;
  formStatus = 'form';
  isDataLoaded = false;
  createNew = false;
  hipaaOptions = [
    'Name',
    'All geographic subdivisions smaller than a state, including street address, city, county, precinct, zip code, and their equivalent geocodes. NOTE: the initial three digits of the zip code are NOT considered an identifier IF, according to the current publicly available data from the Bureau of the Census: (1) The geographic unit formed by combining all zip codes with the same 3 initial digits contains more than 20,000 people and (2) The initial 3 digits of a zip code for all such geographic units containing 20,000 is changed to 000.',
    'All elements of dates (except year) for dates directly related to an individual, including birth date, admission date, discharge date, date of death; and all ages over 89 and all elements of dates (including year) indicative of such age, except that such ages and elements may be aggregated into a single category of age 90 or older. [This means you may record the year but not record the month or day of any date related to the subject if the subject is under the age of 89. In addition if the subject is over the age of 89 you may not record their age and you may not record the month, day or year of any date indicative of age ( except that you may aggregate them into a category ”Age>90” )',
    'Telephone numbers',
    'Fax numbers',
    'Electronic mail addresses',
    'Social Security number',
    'Medical Record number',
    'Health plan beneficiary numbers',
    'Account numbers',
    'Certificate/license numbers',
    'Vehicle identifiers and serial numbers, including license plate numbers',
    'Device identifiers and serial numbers',
    'Web Universal Resource Locators (URLs)',
    'Internet Protocol (IP) address numbers',
    'Biometric identifiers, including finger and voice prints (does not currently include but could eventually include: genomic data)',
    'Full face photographic images and any comparable images  (does not currently include but could eventually include: high resolution MRIs, etc)',
    'Any other unique identifying number, characteristic, code that is derived from or related to information about the individual (e.g. initials, last 4 digits of Social Security #, mother’s maiden name, first 3 letters of last name.)',
  ];

  constructor(
    fb: FormBuilder,
    private cas: CommonsApiService,
    private ras: ResourceApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.loadFields();
    this.fg = fb.group(this.fields);
    this.iThrivForm = new IThrivForm(this.fields, this.fg);
  }

  ngOnInit() {
    this.loadData();
  }

  showNext() {
    this.currentFormChange.emit({ displayForm: 'commons-project' });
    this.currentFormChange.emit({
      currentDataset: this.dataset,
      previousForm: 'commons-dataset-create-edit',
      displayForm: this.previousForm,
    });
  }

  loadFields() {
    this.fields = {
      name: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Dataset Name:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      description: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Brief Description:',
        type: 'textarea',
        options: {
          status: ['words'],
        },
      }),
      keywords: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Key Words:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      identifiers_hipaa: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'HIPAA options:',
        type: 'select',
        selectOptions: this.hipaaOptions,
      }),
      other_sensitive_data: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Other sensitive data:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
    };
  }

  loadFieldsets() {
    this.fieldsets = [];

    for (const fieldName in this.fields) {
      if (this.fields.hasOwnProperty(fieldName)) {
        const field = this.fields[fieldName];

        // If fieldset id is different from current, create new fieldset
        if (
          this.fieldsets.length === 0 ||
          this.fieldsets[this.fieldsets.length - 1].id !== field.fieldsetId
        ) {
          this.fieldsets.push(
            new Fieldset({
              id: field.fieldsetId || Math.random().toString(),
              label: field.fieldsetLabel || null,
              fields: [],
            })
          );
        }

        // Add the field to the fieldset
        this.fieldsets[this.fieldsets.length - 1].fields.push(field);
      }
    }
  }

  loadData() {
    this.isDataLoaded = false;
    if (
      this.dataset === undefined ||
      this.dataset.id === undefined ||
      this.dataset.id === ''
    ) {
      this.createNew = true;
    } else {
      this.createNew = false;
    }
    this.loadForm();
  }

  loadForm() {
    this.isDataLoaded = false;

    for (const fieldName in this.fields) {
      if (this.fields.hasOwnProperty(fieldName)) {
        const field = this.fields[fieldName];
        const validators = [];

        if (field.required) {
          validators.push(Validators.required);
        }

        if (field.minLength) {
          validators.push(Validators.minLength(field.minLength));
        }

        if (field.maxLength) {
          validators.push(Validators.maxLength(field.maxLength));
        }

        if (field.type === 'owldatetime') {
          validators.push(ValidateDateTimeRange);
        }

        if (field.type === 'email') {
          validators.push(Validators.email);
        }

        if (field.type === 'url') {
          validators.push(ValidateUrl);
        }

        if (field.formControl) {
          field.formControl.setValidators(validators);

          if (fieldName === 'ithriv_partner') {
            field.formControl.patchValue(this.dataset[fieldName]);
          } else if (!this.dataset[fieldName] && field.defaultValue) {
            field.formControl.patchValue(field.defaultValue);
          } else if (this.dataset[fieldName]) {
            field.formControl.patchValue(this.dataset[fieldName]);
          }

          this.fg.addControl(fieldName, field.formControl);
        }
      }
    }

    if (!this.createNew) {
      this.validate();
    }

    this.loadFieldsets();
  }

  onFileComplete(data: any) {
    this.dataset.url = data.url;
    this.dataset.filename = data.fileName;
    console.log(data);
  }

  validate() {
    for (const key in this.fg.controls) {
      if (this.fg.controls.hasOwnProperty(key)) {
        const control = this.fg.controls[key];
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    }
  }

  togglePrivate(isPrivate: boolean) {
    this.dataset.private = isPrivate;
    this.cas.updateDataset(this.dataset).subscribe(
      (e) => {},
      (error1) => {}
    );
  }

  submitDataset() {
    this.validate();
    if (!this.fg.valid) {
      return;
    }
    this.dataset.name = this.fields.name.formControl.value;
    this.dataset.description = this.fields.description.formControl.value;
    this.dataset.keywords = this.fields.keywords.formControl.value;
    this.dataset.identifiers_hipaa = this.fields.identifiers_hipaa.formControl.value;
    this.dataset.other_sensitive_data = this.fields.other_sensitive_data.formControl.value;
    if (this.createNew === true) {
      this.cas.createDataset(this.dataset).subscribe(
        (e) => {
          this.errorMessage = '';
          this.formStatus = 'complete';
          this.dataset = e;
          this.showNext();
        },
        (error1) => {
          if (error1) {
            this.errorMessage = error1;
          } else {
            this.errorMessage =
              'Failed to create dataset, please try again later or contact system admin';
          }
          this.formStatus = 'form';
          this.changeDetectorRef.detectChanges();
        }
      );
    } else {
      this.cas.updateDataset(this.dataset).subscribe(
        (e) => {
          this.errorMessage = '';
          this.formStatus = 'complete';
          this.dataset = e;
          this.showNext();
        },
        (error1) => {
          if (error1) {
            this.errorMessage = error1;
          } else {
            this.errorMessage =
              'Failed to update dataset, please try again later or contact system admin';
          }
          this.formStatus = 'form';
          this.changeDetectorRef.detectChanges();
        }
      );
    }

    this.formStatus = 'submitting';
  }

  cancelDataset() {
    this.showNext();
  }

  deleteDataset() {
    this.cas.deleteDataset(this.dataset).subscribe(
      (e) => {
        this.errorMessage = '';
        this.formStatus = 'complete';
        this.showNext();
      },
      (error1) => {
        if (error1) {
          this.errorMessage = error1;
        } else {
          this.errorMessage =
            'Failed to delete dataset, please try again later or contact system admin';
        }
        this.formStatus = 'form';
        this.changeDetectorRef.detectChanges();
      }
    );

    this.formStatus = 'submitting';
  }

  getFields() {
    return this.iThrivForm.getFields();
  }

  onCancel() {
    this.showForm();
  }

  showForm() {
    this.iThrivForm.reset();
    this.formStatus = 'form';
  }

  uploadUrl() {
    // Calculate URL by user institution
    for (const institution_name in environment.landing_service) {
      if (this.user.institution.name === institution_name) {
        return (
          environment.landing_service.url +
          `/commons/datasets/file/${this.dataset.id}`
        );
      }
    }
    // return `http://poc.commons.ithriv.org:80/commons/datasets/file/${this.dataset.id}`;
  }
}
