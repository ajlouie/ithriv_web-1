import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { Category } from '../category';
import { getDummyCategory, mockCategories } from '../shared/fixtures/category';
import { MockMarkdownService } from '../shared/mocks/markdown.service.mock';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
  let httpMock: HttpTestingController;
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [HelpComponent],
        imports: [
          HttpClientTestingModule,
          MarkdownModule,
          MatIconModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          ResourceApiService,
          {provide: MarkdownService, useClass: MockMarkdownService}
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(HelpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const req = httpMock.expectOne(`http://localhost:5000/api/category`);
        expect(req.request.method).toEqual('GET');
        req.flush(mockCategories);

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

  it('should list categories', () => {
    const categoryEls = fixture.debugElement.queryAll(By.css('#site-map li'));
    expect(categoryEls.length).toBeGreaterThan(0);
  });

  it('should link to category details', () => {
    const level0 = fixture.debugElement.queryAll(By.css('#site-map a.level0'));
    expect(level0.length).toBeGreaterThan(0);

    const level1 = fixture.debugElement.queryAll(By.css('#site-map a.level1'));
    expect(level1.length).toBeGreaterThan(0);

    const level2 = fixture.debugElement.queryAll(By.css('#site-map a.level2'));
    expect(level2.length).toBeGreaterThan(0);
  });

  it('should link to a PDF of the site map', () => {
    const linkEls = fixture.debugElement.queryAll(By.css('#site-map .pdf-link'));
    expect(linkEls.length).toBeGreaterThan(0);
  });
});
