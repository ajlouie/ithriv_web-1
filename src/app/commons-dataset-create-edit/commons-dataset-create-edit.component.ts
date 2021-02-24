import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddPermissionComponent } from '../add-permission/add-permission.component';
import { Dataset, IrbInvestigator, IrbNumber, Project, UserPermission, UserPermissionMap } from '../commons-types';
import { ErrorMatcher } from '../error-matcher';
import { Fieldset } from '../fieldset';
import { FormField } from '../form-field';
import { FormSelectOption } from '../form-select-option';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { IThrivForm } from '../shared/IThrivForm';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ValidateDateTimeRange } from '../shared/validators/date_time_range.validator';
import { ValidateUrl } from '../shared/validators/url.validator';
import { User } from '../user';

@Component({
  selector: 'app-commons-dataset-create-edit',
  templateUrl: './commons-dataset-create-edit.component.html',
  styleUrls: ['./commons-dataset-create-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonsDatasetCreateEditComponent implements OnInit {
  public static DATASET_ROLE_MAP_STATIC = [
    {key: '1', value: 'DATASET ADMINISTRATOR'},
    {key: '2', value: 'DATASET COLLABORATOR'},
    {key: '3', value: 'DATASET CUSTOMER'},
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
    'Name (HSD)',
    '2a: All detailed geographic such as street addresses and their equivalent geocodes. (HIPAA identifier) (HSD)',
    '2b: All geographic subdivisions at size of city, zip, or their geocode equivalent (LIMITED DATASET) (LDS)',
    '2c: ONLY the initial three digits of the zip code AND areas containing <20,000 is changed to 000. (NOT HIPAA) (De-ID)',
    '2d: ONLY geographic data at the level of state or larger regions (NOT HIPAA) (De-ID)',
    '3a: Some date data includes month and or day elements (LIMITED DATASET) (LDS)',
    '3b: Date data includes specific ages above age 90 (LIMITED DATASET) (LDS)',
    '3c: Date data is limited to only YEAR and no exact ages exposed above age 90. (NOT HIPAA identifier) (De-ID)',
    'Telephone numbers (HSD)',
    'Fax numbers (HSD)',
    'Electronic mail addresses (HSD)',
    'Social Security number (HSD)',
    'Medical Record number (HSD)',
    'Health plan beneficiary numbers (HSD)',
    'Account numbers (HSD)',
    'Certificate/license numbers (HSD)',
    'Vehicle identifiers and serial numbers, including license plate numbers (HSD)',
    'Device identifiers and serial numbers (HSD)',
    'Web Universal Resource Locators (URLs) (HSD)',
    'Internet Protocol (IP) address numbers (HSD)',
    'Biometric identifiers, including finger and voice prints (HSD)',
    'Full face photographic images and any comparable images (HSD)',
    'Any other unique identifying info (e.g. initials, last 4 digits of SSN, first 3 letters of last name.) (HSD)',
  ];
  userPermission: UserPermission;
  userPermissions$: Observable<UserPermission[]> | undefined;
  displayedUserpermColumns: string[] = ['email', 'role', 'edit', 'delete'];
  dateTimeRange: Date[];
  listOfOptions = [
    {name: 'Generic'},
    {name: 'DICOM'},
    {name: 'REDCap'}
  ];
  toggleOptions = [
    {name: 'true'},
    {name: 'false'}
  ];
  urlFormControl = new FormControl('', [
    Validators.required,
    ValidateUrl,
  ]);
  numberRangeControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(365)
  ]);
  datasetTypeSelected: string;
  irbNumberOptions: FormSelectOption[] = [];
  irbInvestigators: IrbInvestigator[] = [];

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
    this.currentFormChange.emit({displayForm: 'commons-project'});
    this.currentFormChange.emit({
      currentDataset: this.dataset,
      previousForm: 'commons-dataset-create-edit',
      displayForm: this.previousForm,
    });
  }

  getNavLabel(form: String) {
    if (form === 'commons-project') {
      return 'Project Home';
    } else if (form === 'commons-dataset') {
      return 'View Dataset';
    } else {
      return form;
    }
  }

  loadFields() {
    // TODO: Populate options with IRB Protocol numbers from IRB API
    this.cas.getUserIrbNumbers(this.user).subscribe((irbNumbers: IrbNumber[]) => {
      this.irbNumberOptions = irbNumbers.map((irbNumber: IrbNumber) => {
        return new FormSelectOption({id: irbNumber.study_id, name: irbNumber.study_id});
      });
    });

    const irbDocumentOptions: FormSelectOption[] = [];
    this.project.documents.forEach(document => {
      if ((document.type === 'IRB_Approval' || document.type === 'IRB Approval') && document.url !== '') {
        irbDocumentOptions.push(new FormSelectOption({id: document.url, name: document.filename}));
      }
    });
    const contractDocumentOptions = [];
    this.project.documents.forEach(document => {
      if (document.type === 'Contract' && document.url !== '') {
        contractDocumentOptions.push(new FormSelectOption({id: document.url, name: document.filename}));
      }
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
        placeholder: 'Geographic Coverage Description:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      temporal_coverage_date: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Temporal Coverage of Dataset',
        type: 'owldatetime',
        selectMode: 'range',
        pickerMode: 'dialog',
      }),
      study_irb_number: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'IRB Protocol Number:',
        type: 'select',
        multiSelect: false,
        selectOptionsMap: this.irbNumberOptions,
      }),
      approved_irb_link: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Select Corresponding IRB Approval Document from Project Documents',
        type: 'select',
        multiSelect: false,
        selectOptionsMap: irbDocumentOptions,
      }),
      contract_link: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Related Contract:',
        type: 'select',
        multiSelect: false,
        selectOptionsMap: contractDocumentOptions,
      }),
      link_to_external_dataset: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Link to Data (if stored elsewhere):',
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
          field.formControl.setValue('');
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
    this.cas.getDatasetIrbInvestigators(this.user, this.dataset).subscribe(ii => this.irbInvestigators = ii);

    this.userPermissions$ = this.cas.getDatasetPermissions(
      this.user,
      this.dataset,
    );
    this.currentFormChange.emit({
      currentDataset: this.dataset,
      previousForm: this.previousForm,
      displayForm: 'commons-dataset-create-edit',
    });
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
      data: this.buildUserPermissionMap({
        user_email: '',
        user_role: '',
      }),
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      // console.log('The dialog was closed');
      if (result !== null) {
        this.cas
          .addUserDatasetPermission(this.user, this.dataset, result)
          .subscribe(
            (e) => {
              this.loadPermisssions();
              this.errorMessagePerm = '';
            },
            (error1) => {
              this.snackBar.open(error1, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
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
      data: this.buildUserPermissionMap(userPermission),
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      // console.log('The dialog was closed');
      if (result !== null) {
        this.cas
          .addUserDatasetPermission(this.user, this.dataset, result)
          .subscribe(
            (e) => {
              this.cas
                .deleteUserDatasetPermission(
                  this.user,
                  this.dataset,
                  userPermissionCurrent
                )
                .subscribe(
                  () => {
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
                        () => {
                          this.loadPermisssions();
                        },
                        (error2) => {
                          this.snackBar.open(error2, '', {
                            duration: 5000,
                            panelClass: 'snackbar-warning',
                          });
                          this.errorMessagePerm = error2;
                        }
                      );
                    this.snackBar.open(error1, '', {
                      duration: 5000,
                      panelClass: 'snackbar-warning',
                    });
                    this.errorMessagePerm = error1;
                  }
                );
            },
            (error1) => {
              this.snackBar.open(error1, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
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
          this.snackBar.open(error1, '', {
            duration: 5000,
            panelClass: 'snackbar-warning',
          });
          this.errorMessagePerm = error1;
        }
      );
  }

  onFileComplete(data: any) {
    this.dataset.url = data.url;
    this.dataset.filename = data.fileName;
    // console.log(data);
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
      (e) => {
      },
      (error1) => {
      }
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
      this.dataset.study_irb_number = this.fields.study_irb_number.formControl.value;
      this.dataset.approved_irb_link = this.fields.approved_irb_link.formControl.value;
      this.dataset.contract_link = this.fields.contract_link.formControl.value;
      this.dataset.link_to_external_dataset = this.fields.link_to_external_dataset.formControl.value;

      if (this.createNew === true) {
        this.cas.createDataset(this.dataset).subscribe(
          (e) => {
            this.errorMessage = '';
            this.formStatus = 'complete';
            this.dataset = e;
            if (this.dataset.dataset_type === 'REDCap' && this.dataset.redcap_project_token === '') {
              this.ras
                .sendConsultRequestToJIRA(
                  this.user,
                  'Informatics Tools',
                  'Inquiry',
                  'iTHriov commons portal: Request to create REDcap token',
                  this.dataset.redcap_project_url
                )
                .subscribe(
                  () => {
                    this.errorMessage = '';
                  },
                  error1 => {
                    if (error1) {
                      this.snackBar.open(error1, '', {
                        duration: 5000,
                        panelClass: 'snackbar-warning',
                      });
                      this.errorMessage = error1;
                    } else {
                      this.errorMessage =
                        'Failed to submit request to create REDCap tokem, please contact system admin';
                      this.snackBar.open(this.errorMessage, '', {
                        duration: 5000,
                        panelClass: 'snackbar-warning',
                      });
                    }
                  }
                );
            }
            this.showNext();
          },
          (error1) => {
            if (error1) {
              this.snackBar.open(error1, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
              this.errorMessage = error1;
            } else {
              this.errorMessage =
                'Failed to create dataset, please try again later or contact system admin';
              this.snackBar.open(this.errorMessage, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
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
              this.snackBar.open(error1, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
              this.errorMessage = error1;
            } else {
              this.errorMessage =
                'Failed to update dataset, please try again later or contact system admin';
              this.snackBar.open(this.errorMessage, '', {
                duration: 5000,
                panelClass: 'snackbar-warning',
              });
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
                    `${label} is not a valid start and end date/time.`
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
        this.currentFormChange.emit({displayForm: 'commons-project'});
      },
      (error1) => {
        if (error1) {
          this.snackBar.open(error1, '', {
            duration: 5000,
            panelClass: 'snackbar-warning',
          });
          this.error = error1;
        } else {
          this.errorMessage =
            'Failed to delete dataset, please try again later or contact system admin';
          this.snackBar.open(this.errorMessage, '', {
            duration: 5000,
            panelClass: 'snackbar-warning',
          });
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

  private buildUserPermissionMap(userPermission: UserPermission): UserPermissionMap {
    return {
      userPermission: userPermission,
      permissionsMap: CommonsDatasetCreateEditComponent.DATASET_ROLE_MAP_STATIC,
      isDataset: true,
      hasIrbNumber: !!this.dataset.study_irb_number,
      irbInvestigators: this.irbInvestigators,
    };
  }
}
