import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip, MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Resource } from '../resource';
import { getDummyResource } from '../shared/fixtures/resource';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ApprovedBadgeComponent } from './approved-badge.component';

describe('ApprovedBadgeComponent', () => {
  let httpMock: HttpTestingController;
  let component: ApprovedBadgeComponent;
  let fixture: ComponentFixture<ApprovedBadgeComponent>;
  const resource: Resource = getDummyResource();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedBadgeComponent],
      imports: [
        HttpClientTestingModule,
        MatTooltipModule,
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
        fixture = TestBed.createComponent(ApprovedBadgeComponent);
        component = fixture.debugElement.componentInstance;
        component.resource = resource;
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
});
