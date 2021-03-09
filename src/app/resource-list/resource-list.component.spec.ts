import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { ResourceTileComponent } from '../resource-tile/resource-tile.component';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ResourceListComponent } from './resource-list.component';

describe('ResourceListComponent', () => {
  let httpMock: HttpTestingController;
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          ResourceListComponent,
          ResourceTileComponent,
          CategoryColorBorderDirective
        ],
        imports: [
          FormsModule,
          HttpClientTestingModule,
          MarkdownModule,
          MatTooltipModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
          MarkedOptions,
          MarkdownService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(ResourceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();

    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
