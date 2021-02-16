import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dataset } from '../../commons-types';
import { User } from '../../user';
import { mockDataset } from '../fixtures/dataset';
import { mockIrbInvestigators } from '../fixtures/investigators';
import { mockIrbNumbers } from '../fixtures/irb';
import { mockUser } from '../fixtures/user';
import { CommonsApiService } from './commons-api.service';

describe('CommonsApiService', () => {
  let httpMock: HttpTestingController;
  let service: CommonsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        CommonsApiService,
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(CommonsApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get list of IRB Investigators for a dataset', () => {
    service.getDatasetIrbInvestigators(mockUser, mockDataset).subscribe(data => {
      expect(data).toEqual(mockIrbInvestigators);
    });

    const req = httpMock.expectOne(`undefined/commons/meta/datasets/undefined/investigators`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockIrbInvestigators);
  });

  it('should get list of IRB Numbers for a user', () => {
    service.getUserIrbNumbers(mockUser).subscribe(data => {
      expect(data).toEqual(mockIrbNumbers);
    });

    const req = httpMock.expectOne(`undefined/commons/meta/user/${mockUser.email}/irb_protocols`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockIrbNumbers);
  });
});
