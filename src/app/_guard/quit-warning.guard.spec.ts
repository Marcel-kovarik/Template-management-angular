import { TestBed } from '@angular/core/testing';

import { QuitWarningGuard } from './quit-warning.guard';

describe('QuitWarningGuard', () => {
  let guard: QuitWarningGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QuitWarningGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
