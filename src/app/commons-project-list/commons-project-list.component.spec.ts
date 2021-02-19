import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { CommonsProjectTileComponent } from '../commons-project-tile/commons-project-tile.component';
import { CsvExportButtonComponent } from '../csv-export-button/csv-export-button.component';

import { CommonsProjectListComponent } from './commons-project-list.component';

describe('CommonsProjectListComponent', () => {
  let component: CommonsProjectListComponent;
  let fixture: ComponentFixture<CommonsProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryColorBorderDirective,
        CommonsProjectListComponent,
        CommonsProjectTileComponent,
        CsvExportButtonComponent,
      ],
      imports: [
        FlexLayoutModule,
        MarkdownModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
