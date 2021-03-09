import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { MoveCategoryButtonComponent } from './move-category-button.component';

describe('MoveCategoryButtonComponent', () => {
  let httpMock: HttpTestingController;
  let component: MoveCategoryButtonComponent;
  let fixture: ComponentFixture<MoveCategoryButtonComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          MoveCategoryButtonComponent
        ],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
        ],
        providers: [
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(MoveCategoryButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
