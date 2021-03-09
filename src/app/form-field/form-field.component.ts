import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { FormField } from '../form-field';
import { FormSelectOption } from '../form-select-option';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import {
  ToolbarService,
  LinkService,
  ImageService,
  ResizeService,
  TableService,
  HtmlEditorService,
  ImageSettingsModel,
} from '@syncfusion/ej2-angular-richtexteditor';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    ResizeService,
    TableService,
    HtmlEditorService,
  ],
})
export class FormFieldComponent implements OnInit {
  @Input() field: FormField;
  @Input() errors: ValidationErrors;
  @Input() errorMatcher: ErrorStateMatcher;
  @Input() formGroup: FormGroup;
  @Input() resourceType: String;
  public tools: object = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      '|',
      'Undo',
      'Redo',
      '|',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateTable',
      '|',
      'CreateLink',
      'Image',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      '|',
      'FullScreen',
    ],
  };

  public insertImageSettings: ImageSettingsModel = {
    allowedTypes: ['.jpeg', '.jpg', '.png'],
    display: 'inline',
    width: 'auto',
    height: 'auto',
    saveFormat: 'Base64',
    saveUrl: null,
    path: null,
  };

  options = [];
  dataLoaded = false;

  public min = new Date();
  public eventFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  }

  constructor(private api: ResourceApiService) {}

  ngOnInit() {
    this.loadOptions();
  }

  loadOptions() {
    if (this.field.type === 'select') {
      if (this.field.hasOwnProperty('selectOptions') && this.field.selectOptions) {
        this.options = this.field.selectOptions.map(
          (s) => new FormSelectOption({ id: s, name: s })
        );
        this.dataLoaded = true;
      } else if (this.field.hasOwnProperty('selectOptionsMap')) {
        this.options = this.field.selectOptionsMap;
      } else if (this.field.hasOwnProperty('apiSource')) {
        const source = this.field.apiSource;

        if (this.api[source] && typeof this.api[source] === 'function') {
          this.api[source]().subscribe((results) => {
            this.options = results;
            this.field.formControl.updateValueAndValidity();
            this.dataLoaded = true;
          });
        }
      }
    } else {
      this.dataLoaded = true;
    }
  }

  clearValue(fc) {
    fc.setValue('');
  }

  currentLength() {
    return (
      (this.field &&
        this.field.formControl &&
        this.field.formControl.value &&
        this.field.formControl.value.length) ||
      0
    );
  }

  // Replaces underscores with spaces and capitalizes each word in given string
  getLabel(s) {
    return s
      .split('_')
      .map((w) => w[0].toUpperCase() + w.substr(1))
      .join(' ');
  }

  isTextField(field: FormField) {
    return ['text', 'url', 'email', 'password'].indexOf(field.type) > -1;
  }

  isNormalField(field: FormField) {
    return !(
      [
        'tree',
        'richtexteditor',
        'toggle',
        'files',
        'checkbox',
        'owldatetime',
      ].indexOf(field.type) > -1
    );
  }
}
