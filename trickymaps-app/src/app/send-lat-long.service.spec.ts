import { TestBed } from '@angular/core/testing';

import { SendLatLongService } from './send-lat-long.service';

describe('SendLatLongService', () => {
  let service: SendLatLongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendLatLongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
