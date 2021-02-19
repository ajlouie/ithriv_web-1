import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as http from 'http';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { of } from 'rxjs/internal/observable/of';
import { Category } from '../category';
import { getDummyCategory } from '../shared/fixtures/category';
import { mockUser } from '../shared/fixtures/user';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';
import { MockResourceApiService } from '../shared/mocks/resource-api.service.mock';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { CategoryComponent } from './category.component';
import { getDummyResource } from '../shared/fixtures/resource';
import { CategoryResource } from '../category-resource';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    _links: { collection: '', self: '' }
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
          { provide: MarkdownService, useClass: MockMarkdownService },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ category: `${mockCategory.id}` }),
            }
          },
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const categoryReq = httpMock.expectOne(`http://localhost:5000/api/category/${mockCategory.id}`);
    expect(categoryReq.request.method).toEqual('GET');
    categoryReq.flush(mockCategory);

    const categoryResourcesReq = httpMock.expectOne(`http://localhost:5000/api/category/${mockCategory.id}/resource`);
    expect(categoryResourcesReq.request.method).toEqual('GET');
    categoryResourcesReq.flush(mockCategoryResources);

    // const userReq = httpMock.expectOne(`http://localhost:5000/api/session`);
    // expect(userReq.request.method).toEqual('GET');
    // userReq.flush(mockUser);

    expect(component.category).toEqual(mockCategory);
    expect(component.categoryResources).toEqual(mockCategoryResources);
    // expect(component.user).toEqual(mockUser);
  });

  afterEach(() => {
    fixture.destroy();
    // httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
