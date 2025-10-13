import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BeneficiaryRegistrationRoutingModule } from './beneficiary-registration-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BeneficiaryRegistrationRoutingModule,
    SharedModule
  ]
})
export class BeneficiaryRegistrationModule { }
