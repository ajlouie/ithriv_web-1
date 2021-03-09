import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoComponent } from '../logo/logo.component';
import { mockInstitution } from '../shared/fixtures/institution';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let httpMock: HttpTestingController;
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoComponent,
        LogoutComponent,
      ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        ResourceApiService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');
    sessionStorage.setItem('institution_id', `${mockInstitution.id}`);

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const institutionReq = httpMock.expectOne(`http://localhost:5000/api/institution/${mockInstitution.id}`);
    expect(institutionReq.request.method).toEqual('GET');
    institutionReq.flush(mockInstitution);
    expect(component.institution).toEqual(mockInstitution);
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
