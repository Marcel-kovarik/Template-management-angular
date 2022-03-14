import { TestBed } from '@angular/core/testing';

import { BuiltinService } from './builtin.service';

describe('BuiltinService', () => {
  let service: BuiltinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuiltinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
