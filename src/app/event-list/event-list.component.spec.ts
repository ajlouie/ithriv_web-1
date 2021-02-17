import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';
import { MatCard } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { ApprovedBadgeComponent } from '../approved-badge/approved-badge.component';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { CsvExportButtonComponent } from '../csv-export-button/csv-export-button.component';
import { FavoriteResourceButtonComponent } from '../favorite-resource-button/favorite-resource-button.component';
import { ResourceTileComponent } from '../resource-tile/resource-tile.component';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';

import { EventListComponent } from './event-list.component';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ApprovedBadgeComponent,
        CategoryColorBorderDirective,
        CsvExportButtonComponent,
        EventListComponent,
        FavoriteResourceButtonComponent,
        ResourceTileComponent,
      ],
      imports: [
        FlexLayoutModule,
        HttpClientTestingModule,
        MarkdownModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        RouterTestingModule,
      ],
      providers: [
        ResourceApiService,
        { provide: MarkdownService, useClass: MockMarkdownService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
