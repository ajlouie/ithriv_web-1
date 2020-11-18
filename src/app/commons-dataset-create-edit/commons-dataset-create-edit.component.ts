import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { User } from '../user';
import { Dataset, Project, ProjectDocument, UserPermission, UserPermissionMap } from '../commons-types';
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
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { AddPermissionComponent } from '../add-permission/add-permission.component';
import { Observable } from 'rxjs';
import { FormSelectOption } from '../form-select-option';

@Component({
  selector: 'app-commons-dataset-create-edit',
  templateUrl: './commons-dataset-create-edit.component.html',
  styleUrls: ['./commons-dataset-create-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonsDatasetCreateEditComponent implements OnInit {
  public static DATASET_ROLE_MAP_STATIC = [
    { key: '1', value: 'DATASET ADMINISTRATOR' },
    { key: '2', value: 'DATASET COLLABORATOR' },
    { key: '3', value: 'DATASET CUSTOMER' },
  ];
  @Input() user: User;
  @Input() currentForm: String;
  @Input() previousForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() project: Project;
  @Input() dataset: Dataset;
  error: String;
  showConfirmDelete = false;
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  errorMessagePerm: string;
  errorMatcherPerm = new ErrorMatcher();
  fields: any = {};
  fieldsets: Fieldset[] = [];
  files = {};
  fg: FormGroup = new FormGroup({});
  iThrivForm: IThrivForm;
  formStatus = 'form';
  isDataLoaded = false;
  createNew = false;
  hipaaOptions = [
    'NO HIPAA',
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
  userPermission: UserPermission;
  userPermissions$: Observable<UserPermission[]> | undefined;
  displayedUserpermColumns: string[] = ['email', 'role', 'edit', 'delete'];
  dateTimeRange: Date[];

  constructor(
    fb: FormBuilder,
    private cas: CommonsApiService,
    private ras: ResourceApiService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.loadFields();
    // this.fg = fb.group(this.fields);
    this.iThrivForm = new IThrivForm(this.fields, this.fg);
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
    const irbDocumentOptions = [];
    this.project.documents.filter(
      document => (document.type === 'IRB_Approval' ||  document.type === 'IRB Approval') && document.url !== ''
    ).forEach((document) => {
      irbDocumentOptions.push(new FormSelectOption({ id: document.url, name: document.filename }));
    });
    const contractDocumentOptions = [];
    this.project.documents.filter(
      document => document.type === 'Contract' && document.url !== ''
    ).forEach((document) => {
      contractDocumentOptions.push(new FormSelectOption({ id: document.url, name: document.filename }));
    });

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
        required: true,
        placeholder: 'HIPAA options:',
        type: 'select',
        multiSelect: true,
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
      // based_on_dataset_id: new FormField({
      //   formControl: new FormControl(),
      //   required: false,
      //   placeholder: 'Basedon Dataset:',
      //   type: 'select',
      //   multiSelect: true,
      //   selectOptions: [],
      // }),
      variable_measured: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Variable Measured:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      license: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'License:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      spatial_coverage_address: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Spacial Coverage Address:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      temporal_coverage_date: new FormField({
        formControl: new FormControl(),
        required: false,
        maxLength: 140,
        minLength: 1,
        placeholder: 'Coverage Starts ~ Coverage Ends',
        type: 'owldatetime',
        selectMode: 'range',
        pickerMode: 'dialog',
      }),
      approved_irb_link: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Approved IRB:',
        type: 'select',
        multiSelect: false,
        selectOptionsMap: irbDocumentOptions,
      }),
      contract_link: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Approved Contract:',
        type: 'select',
        multiSelect: false,
        selectOptionsMap: contractDocumentOptions,
      }),
      link_to_external_dataset: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Link to External Dataset:',
        type: 'url',
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
    this.loadPermisssions();
  }

  loadPermisssions() {
    this.userPermissions$ = this.cas.getDatasetPermissions(
      this.user,
      this.dataset
    );
  }

  lookupRole(lookupKey: String) {
    let i;
    for (
      i = 0;
      i < CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC.length;
      i++
    ) {
      if (
        CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC[i]['key'] ===
        lookupKey.toString()
      ) {
        return CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC[i][
          'value'
        ];
      }
    }
  }

  addPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent, {
      width: '250px',
      data: <UserPermissionMap>{
        userPermission: <UserPermission>{
          user_email: '',
          user_role: '',
        },
        permissionsMap:
          CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC,
      },
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      console.log('The dialog was closed');
      if (result !== null) {
        this.cas
          .addUserDatasetPermission(this.user, this.dataset, result)
          .subscribe(
            (e) => {
              this.loadPermisssions();
              this.errorMessagePerm = '';
            },
            (error1) => {
              this.errorMessagePerm = error1;
            }
          );
      }
    });
  }

  editPermission(userPermission: UserPermission): void {
    const userPermissionCurrent = <UserPermission>{
      user_email: userPermission.user_email,
      user_role: userPermission.user_role,
    };

    const dialogRef = this.dialog.open(AddPermissionComponent, {
      width: '250px',
      data: <UserPermissionMap>{
        userPermission: userPermission,
        permissionsMap:
          CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC,
      },
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      console.log('The dialog was closed');
      if (result !== null) {
        this.cas
          .deleteUserDatasetPermission(
            this.user,
            this.dataset,
            userPermissionCurrent
          )
          .subscribe(
            (e) => {
              this.cas
                .addUserDatasetPermission(this.user, this.dataset, result)
                .subscribe(
                  (e) => {
                    this.loadPermisssions();
                    this.errorMessagePerm = '';
                  },
                  (error1) => {
                    this.cas
                      .addUserDatasetPermission(
                        this.user,
                        this.dataset,
                        userPermissionCurrent
                      )
                      .subscribe(
                        (e) => {
                          this.loadPermisssions();
                        },
                        (error1) => {
                          this.errorMessagePerm = error1;
                        }
                      );
                    this.errorMessagePerm = error1;
                  }
                );
            },
            (error1) => {
              this.errorMessagePerm = error1;
            }
          );
      } else {
        this.loadPermisssions();
      }
    });
  }

  deletePermission(userPermission: UserPermission) {
    this.cas
      .deleteUserDatasetPermission(this.user, this.dataset, userPermission)
      .subscribe(
        (e) => {
          this.loadPermisssions();
          this.errorMessagePerm = '';
        },
        (error1) => {
          this.errorMessagePerm = error1;
        }
      );
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
    return this.fg.valid;
  }

  togglePrivate(isPrivate: boolean) {
    this.dataset.private = isPrivate;
    this.cas.updateDataset(this.dataset).subscribe(
      (e) => {},
      (error1) => {}
    );
  }

  submitDataset($event) {
    $event.preventDefault();
    this.validate();
    if (this.validate()) {
      this.dataset.name = this.fields.name.formControl.value;
      this.dataset.description = this.fields.description.formControl.value;
      this.dataset.keywords = this.fields.keywords.formControl.value;
      this.dataset.identifiers_hipaa = this.fields.identifiers_hipaa.formControl.value;
      this.dataset.other_sensitive_data = this.fields.other_sensitive_data.formControl.value;
      this.dataset.based_on_dataset_id = '';
      this.dataset.variable_measured = this.fields.variable_measured.formControl.value;
      this.dataset.license = this.fields.license.formControl.value;
      this.dataset.spatial_coverage_address = this.fields.spatial_coverage_address.formControl.value;
      this.dataset.temporal_coverage_date = this.fields.temporal_coverage_date.formControl.value;
      this.dataset.approved_irb_link = this.fields.approved_irb_link.formControl.value;
      this.dataset.contract_link = this.fields.contract_link.formControl.value;
      this.dataset.link_to_external_dataset = this.fields.link_to_external_dataset.formControl.value;

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
    } else {
      const messages: string[] = [];
      const controls = this.fg.controls;
      for (const fieldName in controls) {
        if (controls.hasOwnProperty(fieldName)) {
          const errors = controls[fieldName].errors;
          const label = this.fields[fieldName].placeholder;

          for (const errorName in errors) {
            if (errors.hasOwnProperty(errorName)) {
              switch (errorName) {
                case 'dateTimeRange':
                  messages.push(
                    `${label} is not a valid event start and end date/time.`
                  );
                  break;
                case 'email':
                  messages.push(`${label} is not a valid email address.`);
                  break;
                case 'maxlength':
                  messages.push(`${label} is not long enough.`);
                  break;
                case 'minlength':
                  messages.push(`${label} is too short.`);
                  break;
                case 'required':
                  messages.push(`${label} is empty.`);
                  break;
                case 'url':
                  messages.push(`${label} is not a valid URL.`);
                  break;
                default:
                  messages.push(`${label} has an error.`);
                  break;
              }
            }
          }
        }
      }
      const action = '';
      const message = `Please double-check the following fields: ${messages.join(
        ' '
      )}`;
      this.snackBar.open(message, action, {
        duration: 5000,
        panelClass: 'snackbar-warning',
      });
    }
  }

  cancelDataset() {
    this.showNext();
  }

  deleteDataset() {
    this.cas.deleteDataset(this.dataset).subscribe(
      (e) => {
        this.error = '';
        this.formStatus = 'complete';
        this.currentFormChange.emit({ displayForm: 'commons-project' });
      },
      (error1) => {
        if (error1) {
          this.error = error1;
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

  showDelete() {
    this.showConfirmDelete = true;
  }

  uploadUrl() {
    return (
      this.cas.getLandingServiceUrl(this.user) +
      `/commons/data/datasets/file/${this.dataset.id}`
    );
  }
}
