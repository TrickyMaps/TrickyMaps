import { TestBed } from '@angular/core/testing';

import { GameplayResolverService } from './gameplay-resolver.service';

describe('GameplayResolverService', () => {
  let service: GameplayResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameplayResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
