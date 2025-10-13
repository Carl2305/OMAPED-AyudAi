import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryRegistrationComponent } from './beneficiary-registration.component';

describe('BeneficiaryRegistrationComponent', () => {
  let component: BeneficiaryRegistrationComponent;
  let fixture: ComponentFixture<BeneficiaryRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
