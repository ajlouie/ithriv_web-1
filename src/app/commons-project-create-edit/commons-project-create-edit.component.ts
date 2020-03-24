import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ErrorMatcher } from '../error-matcher';
import { FormField } from '../form-field';
import { IThrivForm } from '../shared/IThrivForm';
import { User } from '../user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { CommonsApiService } from '../shared/commons-api/commons-api.service';
import { Project } from '../commons-types';
import { filter } from 'rxjs/operators';
import { Fieldset } from '../fieldset';
import { ValidateDateTimeRange } from '../shared/validators/date_time_range.validator';

@Component({
  selector: 'app-commons-project-create-edit',
  templateUrl: './commons-project-create-edit.component.html',
  styleUrls: ['./commons-project-create-edit.component.scss']
})
export class CommonsProjectCreateEditComponent implements OnInit {
  @Input() user: User;
  @Input() currentForm: String;
  @Input() previousForm: String;
  @Output() currentFormChange = new EventEmitter();
  @Input() project: Project;
  errorMessage: string;
  errorMatcher = new ErrorMatcher();
  fields: any = {};
  fieldsets: Fieldset[] = [];
  fg: FormGroup;
  iThrivForm: IThrivForm;
  formStatus = 'form';
  isDataLoaded = false;
  createNew = false;
  institutionOptions = ['Virginia Tech', 'Carilion', 'Inova', 'UVA'];

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

  loadFields() {
    this.fields = {
      name: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Project Full Title:',
        type: 'text',
        options: {
          status: ['words']
        }
      }),
      name_alts: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Alternate Project Name(s):',
        type: 'text',
        options: {
          status: ['words']
        }
      }),
      pl_pi: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Project Lead / Principal Investigator(s):',
        type: 'email',
        options: {
          status: ['words']
        }
      }),
      description: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Brief Description:',
        type: 'textarea',
        options: {
          status: ['words']
        }
      }),
      keywords: new FormField({
        formControl: new FormControl(),
        required: true,
        placeholder: 'Key Words:',
        type: 'text',
        options: {
          status: ['words']
        }
      }),
      ithriv_partner: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Partner iTHRIV Institutions:',
        type: 'select',
        selectOptions: this.institutionOptions
      }),
      other_partner: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Other Partner Institutions:',
        type: 'text',
        options: {
          status: ['words']
        }
      }),
      funding_source: new FormField({
        formControl: new FormControl(),
        required: false,
        placeholder: 'Funding Source(s):',
        type: 'text',
        options: {
          status: ['words']
        }
      })
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
              fields: []
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
        ithriv_partner: this.fields.ithriv_partner.formControl.value,
        other_partner: this.fields.other_partner.formControl.value
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
          validators.push(Validators.email);
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

  submitProject() {
    this.validate();
    if (!this.fg.valid) {
      return;
    }
    this.project.name = this.fields.name.formControl.value;
    this.project.name_alts = this.fields.name_alts.formControl.value;
    this.project.pl_pi = this.fields.pl_pi.formControl.value;
    this.project.description = this.fields.description.formControl.value;
    this.project.keywords = this.fields.keywords.formControl.value;
    this.project.funding_source = this.fields.funding_source.formControl.value;
    this.project.ithriv_partner = this.fields.ithriv_partner.formControl.value;
    this.project.other_partner = this.fields.other_partner.formControl.value;

    if (this.createNew === true) {
      this.cas.createProject(this.project).subscribe(
        e => {
          this.errorMessage = '';
          this.formStatus = 'complete';
          this.project = e;
          this.showNext();
        },
        error1 => {
          if (error1) {
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
        e => {
          this.errorMessage = '';
          this.formStatus = 'complete';
          this.project = e;
          this.showNext();
        },
        error1 => {
          if (error1) {
            this.errorMessage = error1;
          } else {
            this.errorMessage =
              'Failed to create project, please try again later or contact system admin';
          }
          this.formStatus = 'form';
          this.changeDetectorRef.detectChanges();
        }
      );
    }

    this.formStatus = 'submitting';
  }
  cancelProject() {
    this.currentFormChange.emit({
      displayForm: this.previousForm
    });
  }

  showNext() {
    this.currentFormChange.emit({
      currentProject: this.project,
      previousForm: 'commons-project-create-edit',
      displayForm: 'commons-project'
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
}
