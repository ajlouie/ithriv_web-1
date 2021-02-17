import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryTileComponent } from '../category-tile/category-tile.component';
import { GradientBorderDirective } from '../gradient-border.directive';
import { ResourceListComponent } from '../resource-list/resource-list.component';
import { ResourceQuery } from '../resource-query';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let httpMock: HttpTestingController;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryTileComponent,
        GradientBorderDirective,
        HomeComponent,
        ResourceListComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ResourceApiService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    component.resourceQuery = new ResourceQuery({
      query: '',
      filters: [],
      facets: [],
      total: 0,
      size: 0,
      start: 0,
      sort: '',
      resources: [],
    });
    fixture.detectChanges();

    const categoriesReq = httpMock.expectOne(`http://localhost:5000/api/category/root`);
    expect(categoriesReq.request.method).toEqual('GET');
    categoriesReq.flush([]);

    const resourcesReqs = httpMock.match(`http://localhost:5000/api/resource`);
    resourcesReqs.forEach(resourcesReq => {
      console.log('resourcesReq', resourcesReq);
      expect(resourcesReq.request.method).toEqual('GET');
      resourcesReq.flush([]);
    });
  });

  afterEach(() => {
    fixture.destroy();
    // httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
