import { TestBed } from '@angular/core/testing';

import { ClassificationPrioritizationService } from './classification-prioritization.service';

describe('ClassificationPrioritizationService', () => {
  let service: ClassificationPrioritizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassificationPrioritizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
