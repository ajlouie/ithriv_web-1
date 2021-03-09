import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MarkdownModule, MarkdownService, MarkedOptions } from 'ngx-markdown';
import { CategoryColorBorderDirective } from '../category-color-border.directive';
import { getDummyCategory } from '../shared/fixtures/category';
import { mockInstitution } from '../shared/fixtures/institution';
import { getDummyResource } from '../shared/fixtures/resource';
import { getDummyUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { ResourceComponent } from './resource.component';

interface ComponentOptions {
  makePrivate?: boolean;
  userMayView?: boolean;
  userMayEdit?: boolean;
}

describe('ResourceComponent', () => {
  let httpMock: HttpTestingController;
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  const getDummyData = (options: ComponentOptions) => {
    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');
    sessionStorage.setItem('institution_id', `${mockInstitution.id}`);

    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');
    fixture.detectChanges();

    const resource = getDummyResource();
    resource.private = options.makePrivate;
    resource.user_may_view = options.userMayView;
    resource.user_may_edit = options.userMayEdit;
    resource.segment = {
      id: 0,
      name: '',
    };

    const user = getDummyUser();
    user.role = options.userMayEdit ? 'Admin' : 'User';

    const resourcecategories = [{
      id: 0,
      category_id: 123,
      resource_id: 999,
      category: getDummyCategory()
    }];

    const userReq = httpMock.expectOne('http://localhost:5000/api/session');
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(user);

    const resourceReq = httpMock.expectOne('http://localhost:5000/api/resource/undefined');
    expect(resourceReq.request.method).toEqual('GET');
    resourceReq.flush(resource);

    const categoryReq = httpMock.expectOne(`http://localhost:5000/api/resource/${resource.id}/category`);
    expect(categoryReq.request.method).toEqual('GET');
    categoryReq.flush(resourcecategories);

    fixture.detectChanges();
  };

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          CategoryColorBorderDirective,
          ResourceComponent
        ],
        imports: [
          BrowserAnimationsModule,
          HttpClientTestingModule,
          MarkdownModule,
          MatTooltipModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [
          ResourceApiService,
          MarkedOptions,
          MarkdownService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();

    sessionStorage.clear();
    localStorage.clear();
  });

  it('should create', () => {
    const options: ComponentOptions = {
      makePrivate: false,
      userMayView: true,
      userMayEdit: false
    };

    getDummyData(options);
    expect(component).toBeTruthy();
  });

  it('should show non-private resource', () => {
    const options: ComponentOptions = {
      makePrivate: false,
      userMayView: true,
      userMayEdit: false
    };

    getDummyData(options); // Non-private resource, general user
    const debugEl: DebugElement = fixture.debugElement.query(By.css('.resource'));
    expect(debugEl).toBeTruthy();
    const resourceElement = debugEl.nativeElement;
    expect(resourceElement.hasAttribute('hidden')).toEqual(false);
  });

  it('should mark private resource', () => {
    const options: ComponentOptions = {
      makePrivate: true,
      userMayView: true,
      userMayEdit: false
    };

    getDummyData(options);
    const classes = fixture.debugElement.query(By.css('.resource')).classes;
    expect(classes.private).toEqual(true);
  });

  it('should hide private resource', () => {
    const options: ComponentOptions = {
      makePrivate: true,
      userMayView: false,
      userMayEdit: false
    };

    getDummyData(options);
    const el = fixture.debugElement.query(By.css('.resource')).nativeElement;
    expect(el.hasAttribute('hidden')).toEqual(true);
  });

  it('should toggle private resource to non-private if non-private button is clicked', () => {
    const options: ComponentOptions = {
      makePrivate: true,
      userMayView: true,
      userMayEdit: true
    };

    getDummyData(options);
    spyOn(component, 'togglePrivate');

    const btn: HTMLElement = fixture.debugElement.nativeElement.querySelector('#button-not-private');
    expect(btn).toBeTruthy();
    btn.click();

    fixture.whenStable().then(() => {
      expect(component.togglePrivate).toHaveBeenCalledWith(false);
    });
  });

  it('should toggle non-private resource to private if private button is clicked', async () => {
    const options: ComponentOptions = {
      makePrivate: false,
      userMayView: true,
      userMayEdit: true
    };

    getDummyData(options);
    spyOn(component, 'togglePrivate');

    const btn: HTMLElement = fixture.debugElement.nativeElement.querySelector('#button-private');
    expect(btn).toBeTruthy();
    btn.click();

    fixture.whenStable().then(() => {
      expect(component.togglePrivate).toHaveBeenCalledWith(true);
    });
  });
});
