import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { LoginServicesComponent } from './login-services.component';

describe('LoginServicesComponent', () => {
  let httpMock: HttpTestingController;
  let component: LoginServicesComponent;
  let fixture: ComponentFixture<LoginServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginServicesComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatTooltipModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            routeConfig: {path: 'register'},
            queryParams: of({}),
          }
        },
        ResourceApiService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(LoginServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const req = httpMock.expectOne(`http://localhost:5000/api/institution`);
        expect(req.request.method).toEqual('GET');
        req.flush([
          {id: 1, name: 'UVA'},
          {id: 2, name: 'Carilion'},
          {id: 3, name: 'Virginia Tech'},
          {id: 4, name: 'Inova'},
        ]);
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
