import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddPermissionComponent } from '../add-permission/add-permission.component';
import { CommonsState, CommonsStateForm, Project, UserPermission, UserPermissionMap } from '../commons-types';
import { ErrorMatcher } from '../error-matcher';
import { ParsedError } from '../error-message/error-message.component';
import { ErrorSnackbarComponent } from '../error-snackbar/error-snackbar.component';
import { Fieldset } from '../fieldset';
import { FormField } from '../form-field';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { IThrivForm } from '../shared/IThrivForm';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ValidateEmail } from '../shared/validators/comms_sep_email.validator';
import { ValidateDateTimeRange } from '../shared/validators/date_time_range.validator';
import { ValidateUrl } from '../shared/validators/url.validator';
import { User } from '../user';

@Component({
  selector: 'app-commons-project-create-edit',
  templateUrl: './commons-project-create-edit.component.html',
  styleUrls: ['./commons-project-create-edit.component.scss'],
})
export class CommonsProjectCreateEditComponent implements OnInit, OnChanges {
  public static PROJECT_ROLE_MAP_STATIC = [
    {key: '1', value: 'PROJECT OWNER'},
    {key: '2', value: 'PROJECT COLLABORATOR'},
  ];
  @Input() user: User;
  @Input() currentForm: CommonsStateForm;
  @Input() previousForm: CommonsStateForm;
  @Output() currentFormChange = new EventEmitter<CommonsState>();
  @Input() project: Project;
  @Input() projectAction: string;
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  errorMessagePerm: string;
  errorMatcherPerm = new ErrorMatcher();
  fields: any = {};
  fieldsets: Fieldset[] = [];
  fg: FormGroup = new FormGroup({});
  iThrivForm: IThrivForm;
  formStatus = 'form';
  isDataLoaded = false;
  showConfirmDelete = false;
  createNew = false;
  institutionOptions = ['Virginia Tech', 'Carilion', 'Inova', 'UVA'];
  error: String;
  userPermission: UserPermission;
  userPermissions$: Observable<UserPermission[]> | undefined;
  displayedUserpermColumns: string[] = ['email', 'role', 'edit', 'delete'];

  constructor(
    fb: FormBuilder,
    private cas: CommonsApiService,
    private ras: ResourceApiService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.loadFields();
    // this.fg = fb.group(this.fields);
    this.iThrivForm = new IThrivForm(this.fields, this.fg);
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
  }

  loadFields() {
    this.fields = {
      name: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Project Full Title:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      name_alts: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Alternate Project Name(s):',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      pl_pi: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Project Lead / Principal Investigator(s) Email(s):',
        helpText: 'Acceptable formats: USERID@virginia.edu, USERID@vt.edu, USERID@carilionclinic.org, USERID@inova.org',
        type: 'email',
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
      // ithriv_partner: new FormField({
      //   formControl: new FormControl(),
      //   required: false,
      //   placeholder: 'Partner iTHRIV Institutions:',
      //   type: 'select',
      //   selectOptions: this.institutionOptions,
      // }),
      partners: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Partner Institutions:',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      funding_source: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Funding Source(s):',
        type: 'text',
        options: {
          status: ['words'],
        },
      }),
      web_page_url: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Link to project webpage:',
        type: 'url',
      }),
    };
  }

  loadFieldsets() {
    this.fieldsets = [];

    // Loop through each form field
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
      this.project === undefined ||
      this.project.id === undefined ||
      this.project.id === ''
    ) {
      this.createNew = true;
      this.project = <Project>{
        id: '',
        collab_mgmt_service_id: '',
        name: this.fields.name.formControl.value,
        name_alts: this.fields.name_alts.formControl.value,
        pl_pi: this.fields.pl_pi.formControl.value,
        description: this.fields.description.formControl.value,
        keywords: this.fields.keywords.formControl.value,
        funding_source: this.fields.funding_source.formControl.value,
        partners: this.fields.partners.formControl.value,
      };
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
          validators.push(ValidateEmail);
        }

        if (field.type === 'url') {
          validators.push(ValidateUrl);
        }

        if (field.formControl) {
          field.formControl.setValidators(validators);

          if (fieldName === 'ithriv_partner') {
            field.formControl.patchValue(this.project[fieldName]);
          } else if (!this.project[fieldName] && field.defaultValue) {
            field.formControl.patchValue(field.defaultValue);
          } else if (this.project[fieldName]) {
            field.formControl.patchValue(this.project[fieldName]);
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
    this.userPermissions$ = this.cas.getProjectPermissions(
      this.user,
      this.project
    );
  }

  lookupRole(lookupKey: String) {
    let i;
    for (
      i = 0;
      i < CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC.length;
      i++
    ) {
      if (
        CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC[i]['key'] ===
        lookupKey.toString()
      ) {
        return CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC[i][
          'value'
          ];
      }
    }
  }

  addPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent, {
      height: '300px',
      width: '400px',
      data: <UserPermissionMap>{
        userPermission: <UserPermission>{
          user_email: '',
          user_role: '',
        },
        permissionsMap:
        CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC,
        isDataset: false,
      },
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      if (result) {
        this.cas
          .addUserProjectPermission(this.user, this.project, result)
          .subscribe(
            (e) => {
              this.loadPermisssions();
              this.errorMessagePerm = '';
            },
            (error1) => {
              this.displayError(error1);
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
      height: '300px',
      width: '400px',
      data: <UserPermissionMap>{
        userPermission: userPermission,
        permissionsMap:
        CommonsProjectCreateEditComponent.PROJECT_ROLE_MAP_STATIC,
        isDataset: false,
      },
    });

    dialogRef.afterClosed().subscribe((result: UserPermission) => {
      if (result) {
        this.cas.addUserProjectPermission(this.user, this.project, result).subscribe(
          () => {
            this.cas.deleteUserProjectPermission(this.user, this.project, userPermissionCurrent).subscribe(
              () => {
                this.loadPermisssions();
                this.errorMessagePerm = '';
              },
              (deletePermissionError) => {
                this.cas.addUserProjectPermission(this.user, this.project, userPermissionCurrent).subscribe(
                  () => {
                    this.loadPermisssions();
                  },
                  (error1) => {
                    this.cas.addUserProjectPermission(this.user, this.project, userPermissionCurrent).subscribe(
                      (e1) => {
                          this.loadPermisssions();
                        },
                      (error2) => {
                        this.displayError(error2);
                        this.errorMessagePerm = error2;
                      }
                    );

                    this.displayError(error1);
                    this.errorMessagePerm = error1;
                  }
                );
              });
          },
            (error1) => {
              this.displayError(error1);
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
      .deleteUserProjectPermission(this.user, this.project, userPermission)
      .subscribe(
        (e) => {
          this.loadPermisssions();
          this.errorMessagePerm = '';
        },
        (error1) => {
          this.displayError(error1);
          this.errorMessagePerm = error1;
        }
      );
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

  submitProject($event) {
    $event.preventDefault();
    if (this.validate()) {
      let updatePIPerms = false;
      if (this.fields.pl_pi.formControl.value !== this.project.pl_pi) {
        updatePIPerms = true;
      }

      this.project.name = this.fields.name.formControl.value;
      this.project.name_alts = this.fields.name_alts.formControl.value;
      this.project.pl_pi = this.fields.pl_pi.formControl.value.toLowerCase();
      this.project.description = this.fields.description.formControl.value;
      this.project.keywords = this.fields.keywords.formControl.value;
      this.project.funding_source = this.fields.funding_source.formControl.value;
      this.project.partners = this.fields.partners.formControl.value;
      this.project.web_page_url = this.fields.web_page_url.formControl.value;
      if (this.createNew === true) {
        this.cas.createProject(this.project).subscribe(
          (e) => {
            this.errorMessage = '';
            this.formStatus = 'form';
            this.project = e;
            for (const pi of this.project.pl_pi.split(',')) {
              this.cas
              .addUserProjectPermission(this.user, this.project,
                <UserPermission>{ user_email: pi.trim().toLowerCase(), user_role: '1' })
              .subscribe(
                (e1) => {
                  this.loadPermisssions();
                  this.errorMessage = '';
                },
                (error1) => {
                  this.errorMessage = '';
                }
              );
            }
            setTimeout(() => {
              this.loadPermisssions();
              this.errorMessage = '';
              this.showNext();
            }, 2000);
          },
          (error1) => {
            if (error1) {
              this.displayError(error1);
              this.errorMessage = error1;
            } else {
              this.errorMessage =
                'Failed to create project, please try again later or contact system admin';
            }
            this.formStatus = 'form';
            this.changeDetectorRef.detectChanges();
          }
        );
      } else {
        this.cas.updateProject(this.project).subscribe(
          (e) => {
            this.errorMessage = '';
            this.formStatus = 'form';
            this.project = e;
            if (updatePIPerms) {
              for (const pi of this.project.pl_pi.split(',')) {
                this.cas
                .addUserProjectPermission(this.user, this.project,
                  <UserPermission>{ user_email: pi.trim().toLowerCase(), user_role: '1' })
                .subscribe(
                  (e1) => {
                    this.loadPermisssions();
                    this.errorMessage = '';
                  },
                  (error1) => {
                    this.errorMessage = '';
                  }
                );
              }
              setTimeout(() => {
                this.loadPermisssions();
                this.errorMessage = '';
                this.showNext();
              }, 2000);
            } else {
              this.project = e;
              this.showNext();
            }
          },
          (error1) => {
            if (error1) {
              this.displayError(error1);
              this.errorMessage = error1;
            } else {
              this.errorMessage =
                'Failed to update project, please try again later or contact system admin';
              this.displayError(this.errorMessage);
            }
            this.formStatus = 'form';
            this.changeDetectorRef.detectChanges();
          }
        );
      }

      this.formStatus = 'submitting';
    } else {
      const messages: ParsedError = {
        title: 'Please double-check the following fields:',
        errors: [],
      };
      const controls = this.fg.controls;
      for (const fieldName in controls) {
        if (controls.hasOwnProperty(fieldName)) {
          const errors = controls[fieldName].errors;
          const label = this.fields[fieldName].placeholder;

          for (const errorName in errors) {
            if (errors.hasOwnProperty(errorName)) {
              switch (errorName) {
                case 'dateTimeRange':
                  messages.errors.push({title: label, messages: [`Not a valid event start and end date/time.`]});
                  break;
                case 'email':
                  messages.errors.push({title: label, messages: [`Not a valid email address.`]});
                  break;
                case 'maxlength':
                  messages.errors.push({title: label, messages: [`Not long enough.`]});
                  break;
                case 'minlength':
                  messages.errors.push({title: label, messages: [`Too short.`]});
                  break;
                case 'required':
                  messages.errors.push({title: label, messages: [`This field is required. It is currently empty.`]});
                  break;
                case 'url':
                  messages.errors.push({title: label, messages: [`Not a valid URL.`]});
                  break;
                default:
                  messages.errors.push({title: label, messages: [`Has an error.`]});
                  break;
              }
            }
          }
        }
      }
      this.displayError(JSON.stringify(messages));
    }
  }

  cancelProject() {
    this.currentFormChange.emit({
      displayForm: this.previousForm,
    });
  }

  deleteProject() {
    this.cas.deleteProject(this.project).subscribe(
      (e) => {
        this.currentFormChange.emit({
          currentProject: this.project,
          previousForm: 'commons-projects-list',
          displayForm: 'commons-projects-list',
        });
      },
      (error1) => {
        this.displayError(error1);
        this.error = error1;
      }
    );
  }

  showNext() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-project-create-edit',
      displayForm: 'commons-project',
    });
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

  private displayError(errorString: string) {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      data: { errorString, action: 'Ok' },
      duration: 5000,
      panelClass: 'snackbar-warning',
    });
  }
}
