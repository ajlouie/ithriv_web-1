import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { SessionRedirectComponent } from './session-redirect.component';

describe('SessionRedirectComponent', () => {
  let httpMock: HttpTestingController;
  let component: SessionRedirectComponent;
  let fixture: ComponentFixture<SessionRedirectComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [SessionRedirectComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              params: observableOf({token: ''}),
            }
          },
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(SessionRedirectComponent);
        component = fixture.componentInstance;
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
