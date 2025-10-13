import { TestBed } from '@angular/core/testing';

import { ReportsAuditService } from './reports-audit.service';

describe('ReportsAuditService', () => {
  let service: ReportsAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
