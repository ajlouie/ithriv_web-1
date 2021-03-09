import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { MarkdownModule } from 'ngx-markdown';
import { GradientBackgroundDirective } from '../gradient-background.directive';
import { mockCategories } from '../shared/fixtures/category';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { BrowseComponent } from './browse.component';

describe('BrowseComponent', () => {
  let httpMock: HttpTestingController;
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          BrowseComponent,
          GradientBackgroundDirective,
        ],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MarkdownModule,
          RouterTestingModule.withRoutes([])
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          ResourceApiService,
          ScrollToService,
        ]
      })
      .compileComponents();
  });

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:5000/api/category`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockCategories);
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

