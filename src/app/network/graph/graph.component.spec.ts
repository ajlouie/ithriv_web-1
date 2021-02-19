import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { InlineSVGDirective } from 'ng-inline-svg';
import { getDummyCategory } from '../../shared/fixtures/category';
import { ResourceApiService } from '../../shared/resource-api/resource-api.service';
import { NodeComponent } from '../node/node.component';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let httpMock: HttpTestingController;
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;
  const mockCategories = [getDummyCategory()];

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        GraphComponent,
        NodeComponent,
        InlineSVGDirective
      ],
      imports: [
        HttpClientTestingModule,
        MatTooltipModule,
        RouterTestingModule.withRoutes([])
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
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(`http://localhost:5000/api/category`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockCategories);
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
