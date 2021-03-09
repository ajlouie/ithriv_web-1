import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockInstitution } from '../shared/fixtures/institution';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { FavoriteResourceListComponent } from './favorite-resource-list.component';

describe('FavoriteResourceListComponent', () => {
  let httpMock: HttpTestingController;
  let component: FavoriteResourceListComponent;
  let fixture: ComponentFixture<FavoriteResourceListComponent>;
  const mockRouter = {
    createUrlTree: jasmine.createSpy('createUrlTree'),
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [FavoriteResourceListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        ResourceApiService,
        {provide: Router, useValue: mockRouter},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(FavoriteResourceListComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    component.institution = mockInstitution;
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:5000/api/session/favorite`);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
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
