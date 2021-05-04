import { TestBed } from '@angular/core/testing';

import { SendScoreService } from './send-score.service';

describe('SendScoreService', () => {
  let service: SendScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
