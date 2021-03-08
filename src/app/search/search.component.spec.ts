import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Route } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { GradientBorderDirective } from '../gradient-border.directive';
import { Resource } from '../resource';
import { ResourceQuery } from '../resource-query';
import { getDummyResource } from '../shared/fixtures/resource';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let httpMock: HttpTestingController;
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const resources: Resource[] = [getDummyResource()];

  beforeEach(async(() => {
    const route: Route = { path: 'search', component: SearchComponent, data: { title: 'Search Resources' } };

    TestBed
      .configureTestingModule({
        declarations: [
          SearchComponent,
          GradientBorderDirective
        ],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MatExpansionModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatListModule,
          MatPaginatorModule,
          MatSidenavModule,
          MatTooltipModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([route])
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              queryParamMap: observableOf({ query: '', keys: [] }),
            }
          },
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        component.resourceQuery = new ResourceQuery({
          query: '',
          filters: [],
          facets: [],
          total: 0,
          size: 0,
          start: 0,
          resources: [],
        });
        fixture.detectChanges();

        const req = httpMock.expectOne(`http://localhost:5000/api/search`);
        expect(req.request.method).toEqual('POST');
        req.flush(resources);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
