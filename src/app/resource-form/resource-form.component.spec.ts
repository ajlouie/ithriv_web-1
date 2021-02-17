import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { TimeLeftPipe } from '../shared/filters/time-left.pipe';
import { mockUser } from '../shared/fixtures/user';
import { MockResourceApiService } from '../shared/mocks/resource-api.service.mock';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ResourceFormComponent } from './resource-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getDummyCategory } from '../shared/fixtures/category';

describe('ResourceFormComponent', () => {
  let httpMock: HttpTestingController;
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;
  const category = getDummyCategory();

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          ResourceFormComponent,
          TimeLeftPipe,
        ],
        imports: [
          BrowserAnimationsModule,
          FormsModule,
          HttpClientTestingModule,
          MatSnackBarModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              params: observableOf({ email_token: 'skhjdfklhafljkhljkhafdkadshfk' }),
            }
          },
          ResourceApiService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');

    const userReqs = httpMock.match('http://localhost:5000/api/session');
    userReqs.forEach(userReq => {
      expect(userReq.request.method).toEqual('GET');
      userReq.flush(mockUser);
      expect(component.user).toEqual(mockUser);
    });

    const categoryReq = httpMock.expectOne('http://localhost:5000/api/category');
    expect(categoryReq.request.method).toEqual('GET');
    categoryReq.flush([]);

    const segmentReq = httpMock.expectOne('http://localhost:5000/api/segment');
    expect(segmentReq.request.method).toEqual('GET');
    segmentReq.flush([{id: 0, name: ''}]);

    const sessionStatusReq = httpMock.expectOne('http://localhost:5000/api/session_status');
    expect(sessionStatusReq.request.method).toEqual('GET');
    sessionStatusReq.flush(mockUser);
    expect(component.user).toEqual(mockUser);
  });

  afterEach(() => {
    fixture.destroy();
    // httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a checkbox for private resource', () => {
    expect(component.fields.hasOwnProperty('private')).toBeTruthy();
    console.log('component.fields', component.fields);
    expect(component.fields.private.type).toEqual('checkbox');
  });
});
