import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getDummyResource } from '../shared/fixtures/resource';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { UserResourceListComponent } from './user-resource-list.component';

describe('UserResourceListComponent', () => {
  let httpMock: HttpTestingController;
  let component: UserResourceListComponent;
  let fixture: ComponentFixture<UserResourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserResourceListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ResourceApiService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserResourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const mockResource1 = getDummyResource();
    const resourceReq1 = httpMock.expectOne(`http://localhost:5000/api/session/resource`);
    expect(resourceReq1.request.method).toEqual('GET');
    resourceReq1.flush([mockResource1]);
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
