import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { FavoriteResourceButtonComponent } from './favorite-resource-button.component';

describe('FavoriteResourceButtonComponent', () => {
  let httpMock: HttpTestingController;
  let component: FavoriteResourceButtonComponent;
  let fixture: ComponentFixture<FavoriteResourceButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteResourceButtonComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatTooltipModule
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
    fixture = TestBed.createComponent(FavoriteResourceButtonComponent);
    component = fixture.componentInstance;
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
