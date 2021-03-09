import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Category } from '../category';
import { GradientBorderDirective } from '../gradient-border.directive';
import { getDummyCategory } from '../shared/fixtures/category';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { CategoryTileComponent } from './category-tile.component';

describe('CategoryTileComponent', () => {
  let httpMock: HttpTestingController;
  let component: CategoryTileComponent;
  let fixture: ComponentFixture<CategoryTileComponent>;
  const category: Category = getDummyCategory();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryTileComponent,
        GradientBorderDirective
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatTooltipModule,
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ResourceApiService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategoryTileComponent);
    component = fixture.componentInstance;
    component.category = category;
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
