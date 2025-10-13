import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiaryRegistrationComponent } from './components/beneficiary-registration/beneficiary-registration.component';

export const routes: Routes = [
  {
    path: '',
    component: BeneficiaryRegistrationComponent,
    title: 'Registro de Beneficiarios - AyudAi'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaryRegistrationRoutingModule { }
