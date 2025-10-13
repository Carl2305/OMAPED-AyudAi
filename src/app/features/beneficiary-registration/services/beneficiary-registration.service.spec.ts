import { TestBed } from '@angular/core/testing';

import { BeneficiaryRegistrationService } from './beneficiary-registration.service';

describe('BeneficiaryRegistrationService', () => {
  let service: BeneficiaryRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
