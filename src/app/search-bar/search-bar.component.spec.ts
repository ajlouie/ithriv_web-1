import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryTileComponent } from '../category-tile/category-tile.component';
import { GradientBackgroundDirective } from '../gradient-background.directive';
import { GradientBorderDirective } from '../gradient-border.directive';
import { getDummyCategory } from '../shared/fixtures/category';
import { mockInstitution } from '../shared/fixtures/institution';
import { mockUser } from '../shared/fixtures/user';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let httpMock: HttpTestingController;
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryTileComponent,
        GradientBackgroundDirective,
        GradientBorderDirective,
        SearchBarComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatExpansionModule,
        MatTooltipModule,
        RouterTestingModule,
      ],
      providers: [
        ResourceApiService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('token', 'MOCK_TOKEN_VALUE');
    sessionStorage.setItem('institution_id', `${mockInstitution.id}`);

    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const userReq = httpMock.expectOne(`http://localhost:5000/api/session`);
    expect(userReq.request.method).toEqual('GET');
    userReq.flush(mockUser);
    expect(component.user).toEqual(mockUser);

    const mockCategories = [getDummyCategory()];
    const categoryReq = httpMock.expectOne(`http://localhost:5000/api/category/root`);
    expect(categoryReq.request.method).toEqual('GET');
    categoryReq.flush(mockCategories);
    expect(component.categories).toEqual(mockCategories);
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
