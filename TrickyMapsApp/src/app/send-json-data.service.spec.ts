import { TestBed } from '@angular/core/testing';

import { SendJsonDataService } from './send-json-data.service';

describe('SendJsonDataService', () => {
  let service: SendJsonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendJsonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
