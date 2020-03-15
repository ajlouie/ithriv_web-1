import { TestBed } from '@angular/core/testing';

import { CommonsApiService } from './commons-api.service';

describe('CommonsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonsApiService = TestBed.get(CommonsApiService);
    expect(service).toBeTruthy();
  });
});
