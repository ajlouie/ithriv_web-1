import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { of } from 'rxjs/internal/observable/of';
import { Category } from '../category';
import { CategoryResource } from '../category-resource';
import { getDummyCategory } from '../shared/fixtures/category';
import { mockInstitution } from '../shared/fixtures/institution';
import { getDummyResource } from '../shared/fixtures/resource';
import { mockUser } from '../shared/fixtures/user';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  let httpMock: HttpTestingController;
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  const mockCategory: Category = getDummyCategory();
  const mockCategoryResources: CategoryResource[] = [{
    id: 0,
    category_id: mockCategory.id,
    resource: getDummyResource(),
    category: mockCategory,
    _links: {collection: '', self: ''}
  }];

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [CategoryComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MarkdownModule,
          MatTooltipModule,
          RouterTestingModule.withRoutes([])
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          ResourceApiService,
          MarkdownService,
          MarkedOptions,
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({category: `${mockCategory.id}`}),
            }
          },
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');
    sessionStorage.setItem('institution_id', `${mockInstitution.id}`);

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const categoryReq = httpMock.expectOne(`http://localhost:5000/api/category/${mockCategory.id}`);
    expect(categoryReq.request.method).toEqual('GET');
    categoryReq.flush(mockCategory);
    expect(component.category).toEqual(mockCategory);

    const categoryResourcesReq = httpMock.expectOne(`http://localhost:5000/api/category/${mockCategory.id}/resource`);
    expect(categoryResourcesReq.request.method).toEqual('GET');
    categoryResourcesReq.flush(mockCategoryResources);
    expect(component.categoryResources).toEqual(mockCategoryResources);

    const userReq = httpMock.expectOne(`http://localhost:5000/api/session`);
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser);
    expect(component.user).toEqual(mockUser);

    expect(component.isDataLoaded).toBeTruthy();
    fixture.detectChanges();
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
