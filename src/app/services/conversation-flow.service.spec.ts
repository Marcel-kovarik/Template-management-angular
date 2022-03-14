import { TestBed } from '@angular/core/testing';

import { ConversationFlowService } from './conversation-flow.service';

describe('ConversationFlowService', () => {
  let service: ConversationFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
