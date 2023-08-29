import { TestBed } from '@angular/core/testing';

import { ToasMessageService } from './toas-message.service';

describe('ToasMessageService', () => {
  let service: ToasMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
