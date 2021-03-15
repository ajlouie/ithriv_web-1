import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatBadgeModule, MatButtonModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatIconModule,
  MatInputModule,
  MatListModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule, MatSelectModule, MatSlideToggleModule, MatTableModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule, MatTreeModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileDropModule } from 'ngx-file-drop';
import { MarkdownModule } from 'ngx-markdown';
import { NgProgressModule } from 'ngx-progressbar';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { CommonsDatasetCreateEditComponent } from '../commons-dataset-create-edit/commons-dataset-create-edit.component';
import { CommonsDatasetComponent } from '../commons-dataset/commons-dataset.component';
import { CommonsFileUploadComponent } from '../commons-file-upload/commons-file-upload.component';
import { CommonsMenuComponent } from '../commons-menu/commons-menu.component';
import { CommonsProjectActionsComponent } from '../commons-project-actions/commons-project-actions.component';
import { CommonsProjectCreateEditComponent } from '../commons-project-create-edit/commons-project-create-edit.component';
import { CommonsProjectListComponent } from '../commons-project-list/commons-project-list.component';
import { CommonsProjectTileComponent } from '../commons-project-tile/commons-project-tile.component';
import { CommonsProjectComponent } from '../commons-project/commons-project.component';
import { CsvExportButtonComponent } from '../csv-export-button/csv-export-button.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FormFieldLabelComponent } from '../form-field-label/form-field-label.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { mockUser } from '../shared/fixtures/user';
import { TreeSelectComponent } from '../tree-select/tree-select.component';
import { CommonsHomeComponent } from './commons-home.component';

describe('CommonsHomeComponent', () => {
  let component: CommonsHomeComponent;
  let fixture: ComponentFixture<CommonsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        CategoryColorBorderDirective,
        CommonsDatasetComponent,
        CommonsDatasetCreateEditComponent,
        CommonsFileUploadComponent,
        CommonsHomeComponent,
        CommonsMenuComponent,
        CommonsProjectActionsComponent,
        CommonsProjectComponent,
        CommonsProjectCreateEditComponent,
        CommonsProjectListComponent,
        CommonsProjectTileComponent,
        CsvExportButtonComponent,
        ErrorMessageComponent,
        FileUploadComponent,
        FormFieldComponent,
        FormFieldLabelComponent,
        TreeSelectComponent,
      ],
      imports: [
        ColorPickerModule,
        FileDropModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientTestingModule,
        MarkdownModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        NoopAnimationsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgProgressModule,
        ReactiveFormsModule,
        RichTextEditorModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsHomeComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.formStatus = 'commons-projects-list';
    component.tabIndex = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project list breadcrumbs', () => {
    const checkBreadcrumbs = (titles: string[]) => {
      component.updateBreadcrumbs();
      titles.forEach((s, i) => {
        expect(component.navItems[i].title).toEqual(s);
      });
    };

    expect(Object.entries((component as any).statusNavItems).length).toEqual(5);

    component.formStatus = 'commons-projects-list';
    component.projectCreateEditPrevForm = 'commons-projects-list';
    component.projectCreateEditPrevForm = 'commons-projects-list';
    checkBreadcrumbs([ 'Commons Home' ]);

    component.formStatus = 'commons-project-create-edit';
    checkBreadcrumbs([ 'Commons Home', 'Edit Project' ]);

    component.projectCreateEditPrevForm = 'commons-project';
    checkBreadcrumbs([ 'Commons Home', 'Project Home', 'Edit Project' ]);

    component.formStatus = 'commons-dataset-create-edit';
    checkBreadcrumbs([ 'Commons Home', 'Project Home', 'Edit Dataset' ]);

    component.datasetCreateEditPrevForm = 'commons-dataset';
    checkBreadcrumbs([ 'Commons Home', 'Project Home', 'View Dataset', 'Edit Dataset' ]);
  });
});
