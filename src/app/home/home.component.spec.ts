import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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
import { mockInstitution } from '../shared/fixtures/institution';
import { getDummyResource } from '../shared/fixtures/resource';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let httpMock: HttpTestingController;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
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
  });

  beforeEach(() => {
    const institutionId = mockInstitution.id;
    sessionStorage.setItem('institution_id', `${institutionId}`);
    localStorage.setItem('token', `MOCK_TOKEN_VALUE`);
    httpMock = TestBed.inject(HttpTestingController);
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

    const userReq = httpMock.expectOne(`http://localhost:5000/api/session`);
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser);
    expect(component.user).toEqual(mockUser);

    const institutionReq = httpMock.expectOne(`http://localhost:5000/api/institution/${institutionId}`);
    expect(institutionReq.request.method).toEqual('GET');
    institutionReq.flush(mockInstitution);
    expect(component.institution).toEqual(mockInstitution);

    const mockResource1 = getDummyResource();
    const resourceReq1 = httpMock.expectOne(`http://localhost:5000/api/resource`);
    expect(resourceReq1.request.method).toEqual('GET');
    resourceReq1.flush([mockResource1]);

    const mockResource2 = getDummyResource({id: 1, name: 'Event'});
    const resourceReq2 = httpMock.expectOne(`http://localhost:5000/api/resource?segment=Event`);
    expect(resourceReq2.request.method).toEqual('GET');
    resourceReq2.flush([mockResource2]);
  });

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
